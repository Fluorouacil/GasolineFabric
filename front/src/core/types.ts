// src/core/types.ts
import { Dayjs } from "dayjs";

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
    status: "active" | "on_leave" | "dismissed";
}

export interface EquipmentType extends BaseModel {
    name: string;
    verification_interval_months: number;
    description?: string;
    equipment?: Equipment[]; // optional при preload
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
    status: "in_use" | "on_verification" | "in_repair" | "decommissioned";
    location: string;
    next_verification_date: string;
}

export interface VerificationHistory extends BaseModel {
    equipment_uuid: UUID;
    equipment: Equipment;
    verification_date: string;
    result: "passed" | "failed";
    certificate_number?: string;
    verified_by_employee_uuid: UUID;
    verified_by_employee: Employee;
    next_verification_date: string;
    notes?: string;
}