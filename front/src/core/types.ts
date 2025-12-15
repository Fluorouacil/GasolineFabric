// src/core/types.ts
export type UUID = string;

export interface BaseModel {
  id: UUID;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Department extends BaseModel {
  name: string;
  code: string;
  adress: string;
}

export interface Person extends BaseModel {
  last_name: string;
  first_name: string;
  middle_name?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
}

export interface Employee extends BaseModel {
  person_uuid: UUID;
  person: Person;
  department_uuid: UUID;
  department: Department;
  position: string;
  hire_date: string;
  status: 'active' | 'on_leave' | 'dismissed';
}

export interface EquipmentType extends BaseModel {
  name: string;
  verification_interval_months: number;
  description?: string;
  equipment?: Equipment[];
  measurable_units?: string[];
}

export interface Equipment extends BaseModel {
  serial_number: string;
  equipment_type_uuid: UUID;
  equipment_type: EquipmentType;
  purchase_date: string;
  cost: number;
  lifespan_years: number;
}

export interface EquipmentStatus extends BaseModel {
  equipment_uuid: UUID;
  equipment: Equipment;
  status: 'in_use' | 'on_verification' | 'in_repair' | 'decommissioned';
  department_uuid: UUID;
  location: Department;
}

export interface VerificationHistory extends BaseModel {
  equipment_uuid: UUID;
  equipment: Equipment;
  verification_date: string;
  result: 'passed' | 'failed';
  certificate_number?: string;
  verified_by_employee_uuid: UUID;
  verified_by_employee: Employee;
  notes?: string;
}

export interface VerificationDueReport {
  equipment_id: UUID;
  serial_number: string;
  equipment_type_name: string;
  department_name: string;
  last_verification: string;
  next_verification: string;
  days_remaining: number;
  status: 'overdue' | 'due_soon' | 'ok';
  responsible_person: string;
}

export interface DepreciationReport {
  equipment_id: UUID;
  serial_number: string;
  equipment_type_name: string;
  department_name: string;
  purchase_date: string;
  original_cost: number;
  lifespan_years: number;
  years_in_service: number;
  annual_depreciation: number;
  accumulated_depr: number;
  residual_value: number;
  depreciation_tax_base: number;
  monthly_depreciation: number;
  depreciation_percent: number;
}

export interface EmployeeReport {
  employee_id: UUID;
  full_name: string;
  position: string;
  department_name: string;
  verifications_count: number;
  last_verification_date: string | null;
}

export interface DepartmentReport {
  department_id: UUID;
  department_name: string;
  department_code: string;
  address: string;
  equipment_count: number;
  employee_count: number;
  total_equipment_value: number;
  equipment_by_status: Record<string, number>;
  upcoming_verifications: number;
}

export interface EquipmentSummaryReport {
  total_count: number;
  total_value: number;
  total_residual_value: number;
  by_status: Record<string, number>;
  by_department: DepartmentSummary[];
  by_type: TypeSummary[];
  verification_stats: VerificationStats;
}

export interface DepartmentSummary {
  department_id: UUID;
  department_name: string;
  equipment_count: number;
  total_value: number;
  residual_value: number;
}

export interface TypeSummary {
  type_id: UUID;
  type_name: string;
  equipment_count: number;
  total_value: number;
}

export interface VerificationStats {
  overdue_count: number;
  due_this_month: number;
  due_next_month: number;
  verified_count: number;
}

export interface ReportFilters {
  department_id?: UUID;
  equipment_type?: UUID;
  date_from?: string;
  date_to?: string;
  status?: string;
}