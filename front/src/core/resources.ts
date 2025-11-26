// src/core/resources.ts
import { FormItemProps } from "antd";
import { Dayjs } from "dayjs";
import { UUID } from "./types";

type FieldConfig<T> = {
    name: keyof T;
    label: string;
    type:
        | "text"
        | "textarea"
        | "number"
        | "select"
        | "date"
        | "radio"
        | "uuid-select";
    required?: boolean;
    options?: { value: string; label: string }[];
    // для select
    resource?: string;
    optionLabel?: (item: any) => string;
    // для date
    format?: string;
    // кастомные правила
    rules?: FormItemProps["rules"];
    // readonly в show/edit
    readOnly?: boolean;
    // в list — колонка
    render?: (value: any, record: T) => React.ReactNode;
};

export type ResourceConfig<T> = {
    name: string;
    label: string;
    fields: FieldConfig<T>[];
    // для preload при create/edit
    preload?: string[];
    // кастомный порядок колонок в list
    listColumns?: (keyof T)[];
};

// Вспомогательная функция для связей
const uuidSelect = <T,>(
    resource: string,
    labelField: keyof T | ((item: T) => string),
    placeholder: string = "Выберите..."
): FieldConfig<any> => ({
    name: `${resource.toLowerCase()}_uuid` as any,
    label: placeholder.replace("Выберите ", ""),
    type: "uuid-select",
    required: true,
    resource,
    optionLabel: typeof labelField === "function" 
        ? labelField 
        : (item: T) => item[labelField] as string,
});


export const departmentConfig: ResourceConfig<Department> = {
    name: "departments",
    label: "Отделы",
    fields: [
        { name: "name", label: "Название", type: "text", required: true },
        { name: "code", label: "Код", type: "text", required: true },
        { name: "adress", label: "Адрес", type: "text" },
    ],
};

export const personConfig: ResourceConfig<Person> = {
    name: "persons",
    label: "Физические лица",
    fields: [
        { name: "last_name", label: "Фамилия", type: "text", required: true },
        { name: "first_name", label: "Имя", type: "text", required: true },
        { name: "middle_name", label: "Отчество", type: "text" },
        {
            name: "birth_date",
            label: "Дата рождения",
            type: "date",
            format: "DD.MM.YYYY",
        },
        { name: "phone", label: "Телефон", type: "text" },
        { name: "email", label: "Email", type: "text" },
    ],
};

export const employeeConfig: ResourceConfig<Employee> = {
    name: "employees",
    label: "Сотрудники",
    preload: ["Person", "Department"],
    fields: [
        uuidSelect<Person>("persons", (p) => `${p.last_name} ${p.first_name} ${p.middle_name || ""}`.trim(), "Сотрудник"),
        uuidSelect<Department>("departments", "name", "Отдел"),
        { name: "position", label: "Должность", type: "text", required: true },
        {
            name: "hire_date",
            label: "Дата приёма",
            type: "date",
            required: true,
            format: "DD.MM.YYYY",
        },
        {
            name: "status",
            label: "Статус",
            type: "radio",
            required: true,
            options: [
                { value: "active", label: "Активен" },
                { value: "on_leave", label: "В отпуске" },
                { value: "dismissed", label: "Уволен" },
            ],
        },
    ],
};

export const equipmentTypeConfig: ResourceConfig<EquipmentType> = {
    name: "equipment-types",
    label: "Типы оборудования",
    fields: [
        { name: "name", label: "Название", type: "text", required: true },
        {
            name: "verification_interval_months",
            label: "Интервал поверки (мес)",
            type: "number",
            required: true,
            rules: [{ type: "number", min: 1, message: "Должно быть > 0" }],
        },
        { name: "description", label: "Описание", type: "textarea" },
    ],
};

export const equipmentConfig: ResourceConfig<Equipment> = {
    name: "equipment",
    label: "Оборудование",
    preload: ["EquipmentType"],
    fields: [
        { name: "serial_number", label: "Серийный №", type: "text", required: true },
        uuidSelect<EquipmentType>("equipment-types", "name", "Тип оборудования"),
        {
            name: "purchase_date",
            label: "Дата покупки",
            type: "date",
            required: true,
            format: "DD.MM.YYYY",
        },
        {
            name: "cost",
            label: "Стоимость",
            type: "number",
            required: true,
            rules: [{ type: "number", min: 0.01, message: "Стоимость > 0" }],
        },
        {
            name: "lifespan_years",
            label: "Срок службы (лет)",
            type: "number",
            required: true,
            rules: [{ type: "number", min: 1, message: "Должно быть > 0" }],
        },
    ],
};

export const equipmentStatusConfig: ResourceConfig<EquipmentStatus> = {
    name: "equipment-statuses",
    label: "Статусы оборудования",
    preload: ["Equipment", "Equipment.EquipmentType"],
    fields: [
        uuidSelect<Equipment>("equipment", (e) => `${e.serial_number} — ${e.equipment_type?.name || "?"}`),
        {
            name: "status",
            label: "Статус",
            type: "radio",
            required: true,
            options: [
                { value: "in_use", label: "В эксплуатации" },
                { value: "on_verification", label: "На поверке" },
                { value: "in_repair", label: "В ремонте" },
                { value: "decommissioned", label: "Списано" },
            ],
        },
        { name: "location", label: "Местоположение", type: "text", required: true },
        {
            name: "next_verification_date",
            label: "Следующая поверка",
            type: "date",
            required: true,
            format: "DD.MM.YYYY",
        },
    ],
};

export const verificationHistoryConfig: ResourceConfig<VerificationHistory> = {
    name: "verification-histories",
    label: "История поверок",
    preload: [
        "Equipment",
        "Equipment.EquipmentType",
        "VerifiedByEmployee",
        "VerifiedByEmployee.Person",
        "VerifiedByEmployee.Department",
    ],
    fields: [
        uuidSelect<Equipment>("equipment", (e) => `${e.serial_number} — ${e.equipment_type?.name || "?"}`),
        uuidSelect<Employee>(
            "employees",
            (e) => `${e.person?.last_name || ""} ${e.person?.first_name || ""}`.trim() || "—",
            "Поверено сотрудником"
        ),
        {
            name: "verification_date",
            label: "Дата поверки",
            type: "date",
            required: true,
            format: "DD.MM.YYYY",
        },
        {
            name: "result",
            label: "Результат",
            type: "radio",
            required: true,
            options: [
                { value: "passed", label: "Пройдено" },
                { value: "failed", label: "Не пройдено" },
            ],
        },
        { name: "certificate_number", label: "№ сертификата", type: "text" },
        {
            name: "next_verification_date",
            label: "Следующая поверка",
            type: "date",
            required: true,
            format: "DD.MM.YYYY",
        },
        { name: "notes", label: "Примечания", type: "textarea" },
    ],
};

export const resourceConfigs = {
    departments: departmentConfig,
    persons: personConfig,
    employees: employeeConfig,
    "equipment-types": equipmentTypeConfig,
    equipment: equipmentConfig,
    "equipment-statuses": equipmentStatusConfig,
    "verification-histories": verificationHistoryConfig,
} as const;

export type ResourceName = keyof typeof resourceConfigs;