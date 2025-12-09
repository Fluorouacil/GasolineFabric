package reports

import (
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type ReportHandler struct {
	service ReportService
}

func NewReportHandler(service ReportService) *ReportHandler {
	return &ReportHandler{service: service}
}

// parseFilters извлекает фильтры из query параметров
func parseFilters(c echo.Context) ReportFilters {
	var filters ReportFilters

	if deptID := c.QueryParam("department_id"); deptID != "" {
		if id, err := uuid.Parse(deptID); err == nil {
			filters.DepartmentID = &id
		}
	}

	if typeID := c.QueryParam("equipment_type"); typeID != "" {
		if id, err := uuid.Parse(typeID); err == nil {
			filters.EquipmentType = &id
		}
	}

	if dateFrom := c.QueryParam("date_from"); dateFrom != "" {
		if t, err := time.Parse("2006-01-02", dateFrom); err == nil {
			filters.DateFrom = &t
		}
	}

	if dateTo := c.QueryParam("date_to"); dateTo != "" {
		if t, err := time.Parse("2006-01-02", dateTo); err == nil {
			filters.DateTo = &t
		}
	}

	if status := c.QueryParam("status"); status != "" {
		filters.Status = &status
	}

	return filters
}

// GetVerificationsDueThisMonth - приборы для поверки в этом месяце
// GET /reports/verifications/this-month
func (h *ReportHandler) GetVerificationsDueThisMonth(c echo.Context) error {
	filters := parseFilters(c)

	result, err := h.service.GetVerificationsDueThisMonth(filters)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":         result,
		"total":        len(result),
		"generated_at": time.Now(),
	})
}

// GetVerificationsDueInPeriod - приборы для поверки в периоде
// GET /reports/verifications/period?date_from=2024-01-01&date_to=2024-01-31
func (h *ReportHandler) GetVerificationsDueInPeriod(c echo.Context) error {
	filters := parseFilters(c)

	if filters.DateFrom == nil || filters.DateTo == nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "date_from and date_to are required (format: YYYY-MM-DD)",
		})
	}

	result, err := h.service.GetVerificationsDueInPeriod(*filters.DateFrom, *filters.DateTo, filters)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  result,
		"total": len(result),
		"period": map[string]interface{}{
			"from": filters.DateFrom,
			"to":   filters.DateTo,
		},
		"generated_at": time.Now(),
	})
}

// GetDepreciationReport - отчёт по амортизации
// GET /reports/depreciation
func (h *ReportHandler) GetDepreciationReport(c echo.Context) error {
	filters := parseFilters(c)

	result, err := h.service.GetDepreciationReport(filters)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// Считаем итоги
	var totals struct {
		TotalOriginalCost    float64 `json:"total_original_cost"`
		TotalResidualValue   float64 `json:"total_residual_value"`
		TotalAccumulatedDepr float64 `json:"total_accumulated_depr"`
		TotalMonthlyDepr     float64 `json:"total_monthly_depr"`
	}

	for _, r := range result {
		totals.TotalOriginalCost += r.OriginalCost
		totals.TotalResidualValue += r.ResidualValue
		totals.TotalAccumulatedDepr += r.AccumulatedDepr
		totals.TotalMonthlyDepr += r.MonthlyDepreciation
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":         result,
		"total":        len(result),
		"totals":       totals,
		"generated_at": time.Now(),
	})
}

// GetEquipmentSummary - сводный отчёт
// GET /reports/equipment/summary
func (h *ReportHandler) GetEquipmentSummary(c echo.Context) error {
	filters := parseFilters(c)

	result, err := h.service.GetEquipmentSummary(filters)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":         result,
		"generated_at": time.Now(),
	})
}

// GetEmployeeReport - отчёт по сотрудникам
// GET /reports/employees
func (h *ReportHandler) GetEmployeeReport(c echo.Context) error {
	filters := parseFilters(c)

	result, err := h.service.GetEmployeeReport(filters)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":         result,
		"total":        len(result),
		"generated_at": time.Now(),
	})
}

// GetDepartmentReport - отчёт по подразделениям
// GET /reports/departments
func (h *ReportHandler) GetDepartmentReport(c echo.Context) error {
	filters := parseFilters(c)

	result, err := h.service.GetDepartmentReport(filters)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":         result,
		"total":        len(result),
		"generated_at": time.Now(),
	})
}

// RegisterRoutes регистрирует маршруты отчётов
func (h *ReportHandler) RegisterRoutes(e *echo.Echo) {
	reports := e.Group("/reports")

	reports.GET("/verifications/this-month", h.GetVerificationsDueThisMonth)
	reports.GET("/verifications/period", h.GetVerificationsDueInPeriod)
	reports.GET("/depreciation", h.GetDepreciationReport)
	reports.GET("/equipment/summary", h.GetEquipmentSummary)
	reports.GET("/employees", h.GetEmployeeReport)
	reports.GET("/departments", h.GetDepartmentReport)
}
