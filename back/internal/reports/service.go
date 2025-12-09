package reports

import (
	"math"
	"time"

	"GasolineFabric/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ReportService struct {
	db *gorm.DB
}

func NewReportService(db *gorm.DB) *ReportService {
	return &ReportService{db: db}
}

// ========== Вспомогательные структуры ==========

type equipmentWithDetails struct {
	models.Equipment
	EquipmentTypeName          string    `gorm:"column:equipment_type_name"`
	DepartmentName             string    `gorm:"column:department_name"`
	DepartmentUUID             uuid.UUID `gorm:"column:department_uuid"`
	VerificationIntervalMonths int       `gorm:"column:verification_interval_months"`
}

type lastVerification struct {
	EquipmentUUID              uuid.UUID
	VerificationDate           time.Time
	VerificationIntervalMonths int // Интервал поверки из типа оборудования
	VerifierLastName           string
	VerifierFirstName          string
	VerifierMiddleName         string
}

// NextVerificationDate вычисляет дату следующей поверки
func (lv lastVerification) NextVerificationDate() time.Time {
	return lv.VerificationDate.AddDate(0, lv.VerificationIntervalMonths, 0)
}

// ========== Поверки ==========

// GetVerificationsDueThisMonth - приборы для поверки в этом месяце
func (s *ReportService) GetVerificationsDueThisMonth(filters ReportFilters) ([]VerificationDueReport, error) {
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Nanosecond)

	return s.GetVerificationsDueInPeriod(startOfMonth, endOfMonth, filters)
}

// GetVerificationsDueInPeriod - приборы для поверки в периоде
func (s *ReportService) GetVerificationsDueInPeriod(from, to time.Time, filters ReportFilters) ([]VerificationDueReport, error) {
	// Шаг 1: Получаем всё оборудование с деталями
	var equipmentList []equipmentWithDetails

	query := s.db.Model(&models.Equipment{}).
		Select(`
			equipment.*,
			equipment_types.name as equipment_type_name,
			equipment_types.verification_interval_months,
			departments.name as department_name,
			equipment_statuses.department_uuid
		`).
		Joins("JOIN equipment_types ON equipment.equipment_type_uuid = equipment_types.id").
		Joins("JOIN equipment_statuses ON equipment_statuses.equipment_uuid = equipment.id").
		Joins("JOIN departments ON equipment_statuses.department_uuid = departments.id").
		Where("equipment_statuses.status != ?", "decommissioned")

	if filters.DepartmentID != nil {
		query = query.Where("equipment_statuses.department_uuid = ?", *filters.DepartmentID)
	}
	if filters.EquipmentType != nil {
		query = query.Where("equipment.equipment_type_uuid = ?", *filters.EquipmentType)
	}

	if err := query.Find(&equipmentList).Error; err != nil {
		return nil, err
	}

	if len(equipmentList) == 0 {
		return []VerificationDueReport{}, nil
	}

	// Шаг 2: Получаем последние поверки
	equipmentIDs := make([]uuid.UUID, len(equipmentList))
	equipmentIntervals := make(map[uuid.UUID]int) // ID оборудования -> интервал поверки

	for i, eq := range equipmentList {
		equipmentIDs[i] = eq.ID
		equipmentIntervals[eq.ID] = eq.VerificationIntervalMonths
	}

	lastVerifications := s.getLastVerifications(equipmentIDs, equipmentIntervals)

	// Шаг 3: Формируем отчёт
	now := time.Now()
	var results []VerificationDueReport

	for _, eq := range equipmentList {
		var nextVerification time.Time
		var lastVerificationDate time.Time
		var responsiblePerson string

		if lv, ok := lastVerifications[eq.ID]; ok {
			lastVerificationDate = lv.VerificationDate
			nextVerification = lv.NextVerificationDate() // Вычисляем на лету
			responsiblePerson = buildFullName(lv.VerifierLastName, lv.VerifierFirstName, lv.VerifierMiddleName)
		} else {
			// Если поверок не было, считаем от даты покупки
			lastVerificationDate = eq.PurchaseDate
			nextVerification = eq.PurchaseDate.AddDate(0, eq.VerificationIntervalMonths, 0)
		}

		// Фильтруем по периоду
		if nextVerification.Before(from) || nextVerification.After(to) {
			continue
		}

		daysRemaining := int(nextVerification.Sub(now).Hours() / 24)

		results = append(results, VerificationDueReport{
			EquipmentID:       eq.ID,
			SerialNumber:      eq.SerialNumber,
			EquipmentTypeName: eq.EquipmentTypeName,
			DepartmentName:    eq.DepartmentName,
			LastVerification:  lastVerificationDate,
			NextVerification:  nextVerification,
			DaysRemaining:     daysRemaining,
			Status:            s.calculateVerificationStatus(daysRemaining),
			ResponsiblePerson: responsiblePerson,
		})
	}

	return results, nil
}

// getLastVerifications - получает последнюю поверку для списка оборудования
func (s *ReportService) getLastVerifications(equipmentIDs []uuid.UUID, intervals map[uuid.UUID]int) map[uuid.UUID]lastVerification {
	result := make(map[uuid.UUID]lastVerification)

	if len(equipmentIDs) == 0 {
		return result
	}

	// Подзапрос для максимальной даты поверки
	type maxDateResult struct {
		EquipmentUUID uuid.UUID `gorm:"column:equipment_uuid"`
		MaxDate       time.Time `gorm:"column:max_date"`
	}

	var maxDates []maxDateResult
	err := s.db.Model(&models.VerificationHistory{}).
		Select("equipment_uuid, MAX(verification_date) as max_date").
		Where("equipment_uuid IN ?", equipmentIDs).
		Group("equipment_uuid").
		Find(&maxDates).Error

	if err != nil || len(maxDates) == 0 {
		return result
	}

	// Получаем полные данные последних поверок
	for _, md := range maxDates {
		var vh models.VerificationHistory
		err := s.db.
			Preload("VerifiedByEmployee").
			Preload("VerifiedByEmployee.Person").
			Where("equipment_uuid = ? AND verification_date = ?", md.EquipmentUUID, md.MaxDate).
			First(&vh).Error

		if err == nil {
			lv := lastVerification{
				EquipmentUUID:              vh.EquipmentUUID,
				VerificationDate:           vh.VerificationDate,
				VerificationIntervalMonths: intervals[vh.EquipmentUUID], // Берём интервал из мапы
			}

			// Безопасная проверка вложенных структур
			if vh.VerifiedByEmployee.ID != uuid.Nil && vh.VerifiedByEmployee.Person.ID != uuid.Nil {
				lv.VerifierLastName = vh.VerifiedByEmployee.Person.LastName
				lv.VerifierFirstName = vh.VerifiedByEmployee.Person.FirstName
				lv.VerifierMiddleName = vh.VerifiedByEmployee.Person.MiddleName
			}

			result[md.EquipmentUUID] = lv
		}
	}

	return result
}

func (s *ReportService) calculateVerificationStatus(daysRemaining int) string {
	switch {
	case daysRemaining < 0:
		return "overdue"
	case daysRemaining <= 7:
		return "due_soon"
	default:
		return "ok"
	}
}

func buildFullName(lastName, firstName, middleName string) string {
	name := lastName
	if firstName != "" {
		name += " " + firstName
	}
	if middleName != "" {
		name += " " + middleName
	}
	return name
}

// ========== Амортизация ==========

func (s *ReportService) GetDepreciationReport(filters ReportFilters) ([]DepreciationReport, error) {
	var equipmentList []equipmentWithDetails

	query := s.db.Model(&models.Equipment{}).
		Select(`
			equipment.*,
			equipment_types.name as equipment_type_name,
			departments.name as department_name
		`).
		Joins("JOIN equipment_types ON equipment.equipment_type_uuid = equipment_types.id").
		Joins("JOIN equipment_statuses ON equipment_statuses.equipment_uuid = equipment.id").
		Joins("JOIN departments ON equipment_statuses.department_uuid = departments.id")

	if filters.DepartmentID != nil {
		query = query.Where("equipment_statuses.department_uuid = ?", *filters.DepartmentID)
	}
	if filters.EquipmentType != nil {
		query = query.Where("equipment.equipment_type_uuid = ?", *filters.EquipmentType)
	}

	if err := query.Find(&equipmentList).Error; err != nil {
		return nil, err
	}

	now := time.Now()
	results := make([]DepreciationReport, 0, len(equipmentList))

	for _, eq := range equipmentList {
		r := DepreciationReport{
			EquipmentID:       eq.ID,
			SerialNumber:      eq.SerialNumber,
			EquipmentTypeName: eq.EquipmentTypeName,
			DepartmentName:    eq.DepartmentName,
			PurchaseDate:      eq.PurchaseDate,
			OriginalCost:      eq.Cost,
			LifespanYears:     eq.LifespanYears,
		}

		// Расчёт амортизации (линейный метод)
		r.YearsInService = now.Sub(eq.PurchaseDate).Hours() / 24 / 365.25
		r.YearsInService = math.Round(r.YearsInService*100) / 100

		// Годовая амортизация = Стоимость / Срок службы
		if eq.LifespanYears > 0 {
			r.AnnualDepreciation = eq.Cost / float64(eq.LifespanYears)
		}
		r.MonthlyDepreciation = r.AnnualDepreciation / 12

		// Накопленная амортизация (не больше первоначальной стоимости)
		r.AccumulatedDepr = math.Min(r.AnnualDepreciation*r.YearsInService, eq.Cost)
		r.AccumulatedDepr = math.Round(r.AccumulatedDepr*100) / 100

		// Остаточная стоимость
		r.ResidualValue = math.Max(eq.Cost-r.AccumulatedDepr, 0)
		r.ResidualValue = math.Round(r.ResidualValue*100) / 100

		// База для налога с амортизации
		r.DepreciationTaxBase = r.ResidualValue

		// Процент износа
		if eq.Cost > 0 {
			r.DepreciationPercent = (r.AccumulatedDepr / eq.Cost) * 100
			r.DepreciationPercent = math.Round(r.DepreciationPercent*100) / 100
		}

		results = append(results, r)
	}

	return results, nil
}

// ========== Сводный отчёт ==========

func (s *ReportService) GetEquipmentSummary(filters ReportFilters) (*EquipmentSummaryReport, error) {
	report := &EquipmentSummaryReport{
		ByStatus: make(map[string]int),
	}

	// Общее количество и стоимость
	type statsResult struct {
		TotalCount int     `gorm:"column:total_count"`
		TotalValue float64 `gorm:"column:total_value"`
	}
	var stats statsResult

	query := s.db.Model(&models.Equipment{})
	if filters.DepartmentID != nil {
		query = query.Joins("JOIN equipment_statuses ON equipment_statuses.equipment_uuid = equipment.id").
			Where("equipment_statuses.department_uuid = ?", *filters.DepartmentID)
	}

	query.Select("COUNT(*) as total_count, COALESCE(SUM(cost), 0) as total_value").
		Scan(&stats)

	report.TotalCount = stats.TotalCount
	report.TotalValue = stats.TotalValue

	// По статусам
	type statusCount struct {
		Status string `gorm:"column:status"`
		Count  int    `gorm:"column:count"`
	}
	var statusStats []statusCount

	statusQuery := s.db.Model(&models.EquipmentStatus{}).
		Select("status, COUNT(*) as count").
		Joins("JOIN equipment ON equipment.id = equipment_statuses.equipment_uuid").
		Group("status")

	if filters.DepartmentID != nil {
		statusQuery = statusQuery.Where("equipment_statuses.department_uuid = ?", *filters.DepartmentID)
	}

	statusQuery.Find(&statusStats)
	for _, sc := range statusStats {
		report.ByStatus[sc.Status] = sc.Count
	}

	// По подразделениям
	s.db.Model(&models.EquipmentStatus{}).
		Select(`
			departments.id as department_id,
			departments.name as department_name,
			COUNT(DISTINCT equipment.id) as equipment_count,
			COALESCE(SUM(equipment.cost), 0) as total_value
		`).
		Joins("JOIN departments ON equipment_statuses.department_uuid = departments.id").
		Joins("JOIN equipment ON equipment.id = equipment_statuses.equipment_uuid").
		Group("departments.id, departments.name").
		Find(&report.ByDepartment)

	// По типам
	s.db.Model(&models.Equipment{}).
		Select(`
			equipment_types.id as type_id,
			equipment_types.name as type_name,
			COUNT(*) as equipment_count,
			COALESCE(SUM(equipment.cost), 0) as total_value
		`).
		Joins("JOIN equipment_types ON equipment.equipment_type_uuid = equipment_types.id").
		Group("equipment_types.id, equipment_types.name").
		Find(&report.ByType)

	// Рассчитываем остаточную стоимость
	depreciation, err := s.GetDepreciationReport(filters)
	if err != nil {
		return nil, err
	}

	deptResidual := make(map[string]float64)
	for _, d := range depreciation {
		deptResidual[d.DepartmentName] += d.ResidualValue
		report.TotalResidualValue += d.ResidualValue
	}

	for i := range report.ByDepartment {
		report.ByDepartment[i].ResidualValue = deptResidual[report.ByDepartment[i].DepartmentName]
	}

	// Статистика по поверкам
	report.VerificationStats = s.calculateVerificationStats(filters)

	return report, nil
}

// calculateVerificationStats - считает статистику по поверкам
func (s *ReportService) calculateVerificationStats(filters ReportFilters) VerificationStats {
	var stats VerificationStats

	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, 0).Add(-time.Nanosecond)
	endOfNextMonth := startOfMonth.AddDate(0, 2, 0).Add(-time.Nanosecond)

	// Получаем все поверки за большой период для анализа
	allFilters := filters
	verifications, err := s.GetVerificationsDueInPeriod(
		now.AddDate(-1, 0, 0), // год назад (для просроченных)
		endOfNextMonth,
		allFilters,
	)
	if err != nil {
		return stats
	}

	for _, v := range verifications {
		switch {
		case v.NextVerification.Before(now):
			stats.OverdueCount++
		case !v.NextVerification.After(endOfMonth): // до конца месяца
			stats.DueThisMonth++
		case !v.NextVerification.After(endOfNextMonth): // до конца следующего месяца
			stats.DueNextMonth++
		}
	}

	// Количество проведённых поверок (за текущий год)
	startOfYear := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, now.Location())
	var verifiedCount int64

	verifiedQuery := s.db.Model(&models.VerificationHistory{}).
		Where("verification_date >= ?", startOfYear)

	if filters.DepartmentID != nil {
		verifiedQuery = verifiedQuery.
			Joins("JOIN equipment_statuses ON equipment_statuses.equipment_uuid = verification_histories.equipment_uuid").
			Where("equipment_statuses.department_uuid = ?", *filters.DepartmentID)
	}

	verifiedQuery.Count(&verifiedCount)
	stats.VerifiedCount = int(verifiedCount)

	return stats
}

// ========== Отчёт по сотрудникам ==========

func (s *ReportService) GetEmployeeReport(filters ReportFilters) ([]EmployeeReport, error) {
	var results []EmployeeReport

	var employees []models.Employee
	query := s.db.Model(&models.Employee{}).
		Preload("Person").
		Preload("Department").
		Where("status = ?", "active")

	if filters.DepartmentID != nil {
		query = query.Where("department_uuid = ?", *filters.DepartmentID)
	}

	if err := query.Find(&employees).Error; err != nil {
		return nil, err
	}

	for _, emp := range employees {
		var verificationCount int64
		var lastVerificationDate *time.Time

		s.db.Model(&models.VerificationHistory{}).
			Where("verified_by_employee_uuid = ?", emp.ID).
			Count(&verificationCount)

		var lastVH models.VerificationHistory
		if err := s.db.Model(&models.VerificationHistory{}).
			Where("verified_by_employee_uuid = ?", emp.ID).
			Order("verification_date DESC").
			First(&lastVH).Error; err == nil {
			lastVerificationDate = &lastVH.VerificationDate
		}

		results = append(results, EmployeeReport{
			EmployeeID:           emp.ID,
			FullName:             buildFullName(emp.Person.LastName, emp.Person.FirstName, emp.Person.MiddleName),
			Position:             emp.Position,
			DepartmentName:       emp.Department.Name,
			VerificationsCount:   int(verificationCount),
			LastVerificationDate: lastVerificationDate,
		})
	}

	return results, nil
}

// ========== Отчёт по подразделениям ==========

func (s *ReportService) GetDepartmentReport(filters ReportFilters) ([]DepartmentReport, error) {
	var departments []models.Department

	query := s.db.Model(&models.Department{})
	if filters.DepartmentID != nil {
		query = query.Where("id = ?", *filters.DepartmentID)
	}

	if err := query.Find(&departments).Error; err != nil {
		return nil, err
	}

	results := make([]DepartmentReport, 0, len(departments))

	for _, dept := range departments {
		report := DepartmentReport{
			DepartmentID:      dept.ID,
			DepartmentName:    dept.Name,
			DepartmentCode:    dept.Code,
			Address:           dept.Adress,
			EquipmentByStatus: make(map[string]int),
		}

		// Количество оборудования
		var eqCount int64
		s.db.Model(&models.EquipmentStatus{}).
			Joins("JOIN equipment ON equipment.id = equipment_statuses.equipment_uuid").
			Where("equipment_statuses.department_uuid = ?", dept.ID).
			Count(&eqCount)
		report.EquipmentCount = int(eqCount)

		// Количество сотрудников
		var empCount int64
		s.db.Model(&models.Employee{}).
			Where("department_uuid = ? AND status = ?", dept.ID, "active").
			Count(&empCount)
		report.EmployeeCount = int(empCount)

		// Общая стоимость
		var totalValue float64
		s.db.Model(&models.Equipment{}).
			Select("COALESCE(SUM(cost), 0)").
			Joins("JOIN equipment_statuses ON equipment_statuses.equipment_uuid = equipment.id").
			Where("equipment_statuses.department_uuid = ?", dept.ID).
			Scan(&totalValue)
		report.TotalEquipmentValue = totalValue

		// По статусам
		type statusCount struct {
			Status string `gorm:"column:status"`
			Count  int    `gorm:"column:count"`
		}
		var statusCounts []statusCount
		s.db.Model(&models.EquipmentStatus{}).
			Select("status, COUNT(*) as count").
			Joins("JOIN equipment ON equipment.id = equipment_statuses.equipment_uuid").
			Where("equipment_statuses.department_uuid = ?", dept.ID).
			Group("status").
			Find(&statusCounts)

		for _, sc := range statusCounts {
			report.EquipmentByStatus[sc.Status] = sc.Count
		}

		// Предстоящие поверки (30 дней)
		now := time.Now()
		endPeriod := now.AddDate(0, 0, 30)
		deptID := dept.ID
		verifications, _ := s.GetVerificationsDueInPeriod(now, endPeriod, ReportFilters{
			DepartmentID: &deptID,
		})
		report.UpcomingVerifications = len(verifications)

		results = append(results, report)
	}

	return results, nil
}
