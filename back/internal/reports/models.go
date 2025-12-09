package reports

import (
	"time"

	"github.com/google/uuid"
)

// VerificationDueReport - отчёт по поверкам
type VerificationDueReport struct {
	EquipmentID       uuid.UUID `json:"equipment_id"`
	SerialNumber      string    `json:"serial_number"`
	EquipmentTypeName string    `json:"equipment_type_name"`
	DepartmentName    string    `json:"department_name"`
	LastVerification  time.Time `json:"last_verification"`
	NextVerification  time.Time `json:"next_verification"`
	DaysRemaining     int       `json:"days_remaining"`
	Status            string    `json:"status"`
	ResponsiblePerson string    `json:"responsible_person"`
}

// DepreciationReport - отчёт по амортизации
type DepreciationReport struct {
	EquipmentID         uuid.UUID `json:"equipment_id"`
	SerialNumber        string    `json:"serial_number"`
	EquipmentTypeName   string    `json:"equipment_type_name"`
	DepartmentName      string    `json:"department_name"`
	PurchaseDate        time.Time `json:"purchase_date"`
	OriginalCost        float64   `json:"original_cost"`
	LifespanYears       int       `json:"lifespan_years"`
	YearsInService      float64   `json:"years_in_service"`
	AnnualDepreciation  float64   `json:"annual_depreciation"`
	AccumulatedDepr     float64   `json:"accumulated_depr"`
	ResidualValue       float64   `json:"residual_value"`
	DepreciationTaxBase float64   `json:"depreciation_tax_base"`
	MonthlyDepreciation float64   `json:"monthly_depreciation"`
	DepreciationPercent float64   `json:"depreciation_percent"`
}

// EquipmentSummaryReport - сводный отчёт
type EquipmentSummaryReport struct {
	TotalCount         int                 `json:"total_count"`
	TotalValue         float64             `json:"total_value"`
	TotalResidualValue float64             `json:"total_residual_value"`
	ByStatus           map[string]int      `json:"by_status"`
	ByDepartment       []DepartmentSummary `json:"by_department"`
	ByType             []TypeSummary       `json:"by_type"`
	VerificationStats  VerificationStats   `json:"verification_stats"`
}

type DepartmentSummary struct {
	DepartmentID   uuid.UUID `json:"department_id"`
	DepartmentName string    `json:"department_name"`
	EquipmentCount int       `json:"equipment_count"`
	TotalValue     float64   `json:"total_value"`
	ResidualValue  float64   `json:"residual_value"`
}

type TypeSummary struct {
	TypeID         uuid.UUID `json:"type_id"`
	TypeName       string    `json:"type_name"`
	EquipmentCount int       `json:"equipment_count"`
	TotalValue     float64   `json:"total_value"`
}

type VerificationStats struct {
	OverdueCount  int `json:"overdue_count"`
	DueThisMonth  int `json:"due_this_month"`
	DueNextMonth  int `json:"due_next_month"`
	VerifiedCount int `json:"verified_count"`
}

type EmployeeReport struct {
	EmployeeID           uuid.UUID  `json:"employee_id"`
	FullName             string     `json:"full_name"`
	Position             string     `json:"position"`
	DepartmentName       string     `json:"department_name"`
	VerificationsCount   int        `json:"verifications_count"`
	LastVerificationDate *time.Time `json:"last_verification_date"`
}

type DepartmentReport struct {
	DepartmentID          uuid.UUID      `json:"department_id"`
	DepartmentName        string         `json:"department_name"`
	DepartmentCode        string         `json:"department_code"`
	Address               string         `json:"address"`
	EquipmentCount        int            `json:"equipment_count"`
	EmployeeCount         int            `json:"employee_count"`
	TotalEquipmentValue   float64        `json:"total_equipment_value"`
	EquipmentByStatus     map[string]int `json:"equipment_by_status"`
	UpcomingVerifications int            `json:"upcoming_verifications"`
}

// ReportFilters - фильтры для отчётов
type ReportFilters struct {
	DepartmentID  *uuid.UUID `query:"department_id"`
	EquipmentType *uuid.UUID `query:"equipment_type"`
	DateFrom      *time.Time `query:"date_from"`
	DateTo        *time.Time `query:"date_to"`
	Status        *string    `query:"status"`
}
