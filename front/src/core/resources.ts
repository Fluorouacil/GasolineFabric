// src/core/resources.ts
import { FormItemProps } from 'antd';

import { Department, Employee, Equipment, EquipmentStatus, EquipmentType, Person, VerificationHistory, EmployeeReport, DepartmentReport, DepreciationReport, VerificationDueReport } from './types';

type FieldConfig<T> = {
  name: keyof T;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'radio' | 'uuid-select' | "money" | "status";
  required?: boolean;
  options?: { value: string; label: string }[];
  resource?: string;
  optionLabel?: (item: any) => string;
  format?: string;
  rules?: FormItemProps['rules'];
  readOnly?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
};

export type ResourceConfig<T> = {
  name: string;
  label: string;
  fields: FieldConfig<T>[];
  preload?: string[];
  listColumns?: (keyof T)[];
  apiResource?: string,
};

export interface TotalItemConfig {
  key: string;
  label: string;
  type?: 'money' | 'number';
  color?: string;
  span?: number;
}
export interface ReportConfig<T> extends ResourceConfig<T> {
  apiResource?: string;
  totalsConfig?: TotalItemConfig[];
}

export function uuidSelect<T>(
  resource: string,
  optionLabel: keyof T | ((item: T) => string),
  label?: string,
  options?: {
    fieldName?: string;
    required?: boolean;
  }
): FieldConfig<any> {
  // 'persons' → 'person_uuid'
  // 'departments' → 'department_uuid'
  // 'equipment-types' → 'equipment_type_uuid'
  // 'equipment' → 'equipment_uuid'
  // 'employees' → 'employee_uuid' (но для verified_by используем кастомное)
  // 'verification-histories' → 'verification_history_uuid'
  
  const generateFieldName = (res: string): string => {
    let normalized = res.replace(/-/g, '_');
    
    if (normalized.endsWith('ies')) {
      normalized = normalized.slice(0, -3) + 'y';
    } else if (normalized.endsWith('ses')) {
      normalized = normalized.slice(0, -2);
    } else if (normalized.endsWith('s') && !normalized.endsWith('ss')) {
      normalized = normalized.slice(0, -1);
    }
    
    return `${normalized}_uuid`;
  };

  const name = options?.fieldName || generateFieldName(resource);

  const generatedLabel = label || resource
    .replace(/-/g, ' ')
    .replace(/s$/, '')
    .replace(/^\w/, c => c.toUpperCase());
  
  return {
    name,
    label: generatedLabel,
    type: 'uuid-select' as const,
    resource,
    optionLabel: typeof optionLabel === 'function' 
      ? optionLabel 
      : String(optionLabel),
    required: options?.required ?? true,
  };
}

export const departmentConfig: ResourceConfig<Department> = {
  name: 'departments',
  label: 'Отделы',
  fields: [
    { name: 'name', label: 'Название', type: 'text', required: true },
    { name: 'code', label: 'Код', type: 'text', required: true },
    { name: 'adress', label: 'Адрес', type: 'text' },
  ],
};

export const personConfig: ResourceConfig<Person> = {
  name: 'persons',
  label: 'Физические лица',
  fields: [
    { name: 'last_name', label: 'Фамилия', type: 'text', required: true },
    { name: 'first_name', label: 'Имя', type: 'text', required: true },
    { name: 'middle_name', label: 'Отчество', type: 'text' },
    {
      name: 'birth_date',
      label: 'Дата рождения',
      type: 'date',
      format: 'DD.MM.YYYY',
    },
    { name: 'phone', label: 'Телефон', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
  ],
};

export const employeeConfig: ResourceConfig<Employee> = {
  name: 'employees',
  label: 'Сотрудники',
  preload: ['Person', 'Department'],
  fields: [
    uuidSelect<Person>(
      'persons',
      (p) => `${p.last_name} ${p.first_name} ${p.middle_name || ''}`.trim(),
      'Сотрудник'
    ),
    uuidSelect<Department>('departments', 'name', 'Отдел'),
    { name: 'position', label: 'Должность', type: 'text', required: true },
    {
      name: 'hire_date',
      label: 'Дата приёма',
      type: 'date',
      required: true,
      format: 'DD.MM.YYYY',
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'radio',
      required: true,
      options: [
        { value: 'active', label: 'Активен' },
        { value: 'on_leave', label: 'В отпуске' },
        { value: 'dismissed', label: 'Уволен' },
      ],
    },
  ],
};

export const equipmentTypeConfig: ResourceConfig<EquipmentType> = {
  name: 'equipment-types',
  label: 'Типы оборудования',
  fields: [
    { name: 'name', label: 'Название', type: 'text', required: true },
    {
      name: 'verification_interval_months',
      label: 'Интервал поверки (мес)',
      type: 'number',
      required: true,
      rules: [{ type: 'number', min: 1, message: 'Должно быть > 0' }],
    },
    { name: 'description', label: 'Описание', type: 'textarea' },
  ],
};

export const equipmentConfig: ResourceConfig<Equipment> = {
  name: 'equipment',
  label: 'Оборудование',
  preload: ['EquipmentType'],
  fields: [
    { name: 'serial_number', label: 'Серийный №', type: 'text', required: true },
    uuidSelect<EquipmentType>('equipment-types', 'name', 'Тип оборудования'),
    {
      name: 'purchase_date',
      label: 'Дата покупки',
      type: 'date',
      required: true,
      format: 'DD.MM.YYYY',
    },
    {
      name: 'cost',
      label: 'Стоимость',
      type: 'number',
      required: true,
      rules: [{ type: 'number', min: 0.01, message: 'Стоимость > 0' }],
    },
    {
      name: 'lifespan_years',
      label: 'Срок службы (лет)',
      type: 'number',
      required: true,
      rules: [{ type: 'number', min: 1, message: 'Должно быть > 0' }],
    },
  ],
};

export const equipmentStatusConfig: ResourceConfig<EquipmentStatus> = {
  name: 'equipment-statuses',
  label: 'Статусы оборудования',
  preload: ['Equipment', 'Equipment.EquipmentType', 'Department'],
  fields: [
    uuidSelect<Equipment>(
      'equipment',
      (e) => `${e.serial_number} — ${e.equipment_type?.name || '?'}`,
      'Оборудование'
    ),
    uuidSelect<Department>('departments', 'name', 'Местоположение'),
    {
      name: 'status',
      label: 'Статус',
      type: 'radio',
      required: true,
      options: [
        { value: 'in_use', label: 'В эксплуатации' },
        { value: 'on_verification', label: 'На поверке' },
        { value: 'in_repair', label: 'В ремонте' },
        { value: 'decommissioned', label: 'Списано' },
      ],
    },
  ],
};

export const verificationHistoryConfig: ResourceConfig<VerificationHistory> = {
  name: 'verification-histories',
  label: 'История поверок',
  preload: [
    'Equipment',
    'Equipment.EquipmentType',
    'VerifiedByEmployee',
    'VerifiedByEmployee.Person',
    'VerifiedByEmployee.Department',
  ],
  fields: [
    uuidSelect<Equipment>(
      'equipment',
      (e) => `${e.serial_number} — ${e.equipment_type?.name || '?'}`,
      'Оборудование'
    ),
    uuidSelect<Employee>(
      'employees',
      (e) => `${e.person?.last_name || ''} ${e.person?.first_name || ''}`.trim() || '—',
      'Поверено сотрудником',
      { fieldName: 'verified_by_employee_uuid' }
    ),
    {
      name: 'verification_date',
      label: 'Дата поверки',
      type: 'date',
      required: true,
      format: 'DD.MM.YYYY',
    },
    {
      name: 'result',
      label: 'Результат',
      type: 'radio',
      required: true,
      options: [
        { value: 'passed', label: 'Пройдено' },
        { value: 'failed', label: 'Не пройдено' },
      ],
    },
    { name: 'certificate_number', label: '№ сертификата', type: 'text' },
    { name: 'notes', label: 'Примечания', type: 'textarea' },
  ],
};

export const verificationDueReportConfig: ReportConfig<VerificationDueReport> = {
  name: 'verifications-due-report',
  apiResource: 'verifications/this-month',
  label: 'Отчёт по поверкам',

  fields: [
    { name: 'serial_number', label: 'Серийный №', type: 'text' },
    { name: 'equipment_type_name', label: 'Тип оборудования', type: 'text' },
    { name: 'department_name', label: 'Подразделение', type: 'text' },
    { name: 'last_verification', label: 'Последняя поверка', type: 'date' },
    { name: 'next_verification', label: 'Следующая поверка', type: 'date' },
    { name: 'days_remaining', label: 'Дней осталось', type: 'number' },
    { name: 'status', label: 'Статус', type: 'status' },
    { name: 'responsible_person', label: 'Ответственный', type: 'text' },
  ],

  listColumns: [
    'serial_number',
    'equipment_type_name',
    'department_name',
    'last_verification',
    'next_verification',
    'days_remaining',
    'status',
    'responsible_person'
  ],

  statusConfig: {
    field: 'status',
    mapping: {
      'overdue': { color: 'red', label: 'Просрочено' },
      'due_soon': { color: 'orange', label: 'Скоро' },
      'ok': { color: 'green', label: 'В норме' }
    }
  },

  rowHighlight: {
    field: 'status',
    rules: [
      { value: 'overdue', color: '#fff2f0' },
      { value: 'due_soon', color: '#fffbe6' }
    ]
  },

  totalsConfig: [
    {
      key: 'overdue_count',
      label: 'Просрочено',
      type: 'number',
      color: '#cf1322',
      span: 6,
      compute: (data) => data.filter(r => r.status === 'overdue').length
    },
    {
      key: 'due_soon_count',
      label: 'Требует внимания',
      type: 'number',
      color: '#fa8c16',
      span: 6,
      compute: (data) => data.filter(r => r.status === 'due_soon').length
    },
    {
      key: 'ok_count',
      label: 'В норме',
      type: 'number',
      color: '#3f8600',
      span: 6,
      compute: (data) => data.filter(r => r.status === 'ok').length
    },
    {
      key: 'total_count',
      label: 'Всего записей',
      type: 'number',
      span: 6,
      compute: (data) => data.length
    }
  ]
};

export const verificationPeriodReportConfig: ReportConfig<VerificationDueReport> = {
  ...verificationDueReportConfig,
  name: 'verifications-period-report',
  apiResource: 'verifications/period',
  label: 'Отчёт по поверкам за период',

  requiredFilters: ['date_from', 'date_to'],
  
  filters: [
    { 
      name: 'date_from', 
      label: 'Дата с', 
      type: 'date',
      required: true 
    },
    { 
      name: 'date_to', 
      label: 'Дата по', 
      type: 'date',
      required: true 
    },
    { 
      name: 'department_id', 
      label: 'Подразделение', 
      type: 'select',
      optionsUrl: '/departments'
    },
    { 
      name: 'equipment_type', 
      label: 'Тип оборудования', 
      type: 'select',
      optionsUrl: '/equipment-types'
    }
  ]
};

export const depreciationReportConfig: ReportConfig<DepreciationReport> = {
  name: 'depreciation-report',
  apiResource: 'depreciation',
  label: 'Отчёт по амортизации',

  fields: [
    { name: 'serial_number', label: 'Серийный №', type: 'text' },
    { name: 'equipment_type_name', label: 'Тип оборудования', type: 'text' },
    { name: 'department_name', label: 'Подразделение', type: 'text' },
    { name: 'purchase_date', label: 'Дата ввода', type: 'date' },
    { name: 'original_cost', label: 'Первонач. ст-ть', type: 'money' },
    { name: 'lifespan_years', label: 'Срок службы (лет)', type: 'number' },
    { name: 'years_in_service', label: 'Лет в эксплуатации', type: 'decimal' },
    { name: 'annual_depreciation', label: 'Годовая аморт.', type: 'money' },
    { name: 'accumulated_depr', label: 'Накопл. аморт.', type: 'money' },
    { name: 'residual_value', label: 'Остаточная ст-ть', type: 'money' },
    { name: 'monthly_depreciation', label: 'Аморт./мес', type: 'money' },
    { name: 'depreciation_percent', label: 'Износ', type: 'percent' },
  ],

  listColumns: [
    'serial_number',
    'equipment_type_name',
    'department_name',
    'purchase_date',
    'original_cost',
    'residual_value',
    'monthly_depreciation',
    'depreciation_percent'
  ],

  filters: [
    { 
      name: 'department_id', 
      label: 'Подразделение', 
      type: 'select',
      optionsUrl: '/departments'
    },
    { 
      name: 'equipment_type', 
      label: 'Тип оборудования', 
      type: 'select',
      optionsUrl: '/equipment-types'
    }
  ],

  totalsConfig: [
    {
      key: 'total_original_cost',
      label: 'Всего первонач. ст-ть',
      type: 'money',
      span: 6
    },
    {
      key: 'total_residual_value',
      label: 'Всего остаточная ст-ть',
      type: 'money',
      color: '#3f8600',
      span: 6
    },
    {
      key: 'total_accumulated_depr',
      label: 'Накопленная аморт.',
      type: 'money',
      color: '#cf1322',
      span: 6
    },
    {
      key: 'total_monthly_depr',
      label: 'Ежемес. амортизация',
      type: 'money',
      span: 6
    }
  ]
};

export const employeeReportConfig: ReportConfig<EmployeeReport> = {
  name: 'employee-report',
  apiResource: 'employees',
  label: 'Отчёт по сотрудникам',

  fields: [
    { name: 'full_name', label: 'ФИО', type: 'text' },
    { name: 'position', label: 'Должность', type: 'text' },
    { name: 'department_name', label: 'Подразделение', type: 'text' },
    { name: 'verifications_count', label: 'Кол-во поверок', type: 'number' },
    { name: 'last_verification_date', label: 'Последняя поверка', type: 'date' },
  ],

  listColumns: [
    'full_name',
    'position',
    'department_name',
    'verifications_count',
    'last_verification_date'
  ],

  filters: [
    { 
      name: 'department_id', 
      label: 'Подразделение', 
      type: 'select',
      optionsUrl: '/departments'
    }
  ],

  totalsConfig: [
    {
      key: 'total_employees',
      label: 'Всего сотрудников',
      type: 'number',
      span: 8,
      compute: (data) => data.length
    },
    {
      key: 'total_verifications',
      label: 'Всего поверок',
      type: 'number',
      span: 8,
      compute: (data) => data.reduce((sum, r) => sum + r.verifications_count, 0)
    },
    {
      key: 'avg_verifications',
      label: 'Среднее на сотрудника',
      type: 'decimal',
      span: 8,
      compute: (data) => data.length > 0 
        ? data.reduce((sum, r) => sum + r.verifications_count, 0) / data.length 
        : 0
    }
  ]
};

export const departmentReportConfig: ReportConfig<DepartmentReport> = {
  name: 'department-report',
  apiResource: 'departments',
  label: 'Отчёт по подразделениям',

  fields: [
    { name: 'department_name', label: 'Название', type: 'text' },
    { name: 'department_code', label: 'Код', type: 'text' },
    { name: 'address', label: 'Адрес', type: 'text' },
    { name: 'equipment_count', label: 'Оборудование', type: 'number' },
    { name: 'employee_count', label: 'Сотрудники', type: 'number' },
    { name: 'total_equipment_value', label: 'Стоимость обор.', type: 'money' },
    { name: 'upcoming_verifications', label: 'Предстоящие поверки', type: 'number' },
  ],

  listColumns: [
    'department_name',
    'department_code',
    'equipment_count',
    'employee_count',
    'total_equipment_value',
    'upcoming_verifications'
  ],

  expandableRow: {
    render: (record) => ({
      title: 'Оборудование по статусам',
      data: record.equipment_by_status
    })
  },

  totalsConfig: [
    {
      key: 'total_departments',
      label: 'Подразделений',
      type: 'number',
      span: 6,
      compute: (data) => data.length
    },
    {
      key: 'total_equipment',
      label: 'Всего оборудования',
      type: 'number',
      span: 6,
      compute: (data) => data.reduce((sum, r) => sum + r.equipment_count, 0)
    },
    {
      key: 'total_employees',
      label: 'Всего сотрудников',
      type: 'number',
      span: 6,
      compute: (data) => data.reduce((sum, r) => sum + r.employee_count, 0)
    },
    {
      key: 'total_value',
      label: 'Общая стоимость',
      type: 'money',
      span: 6,
      compute: (data) => data.reduce((sum, r) => sum + r.total_equipment_value, 0)
    }
  ]
};

export const resourceConfigs = {
  departments: departmentConfig,
  persons: personConfig,
  employees: employeeConfig,
  'equipment-types': equipmentTypeConfig,
  equipment: equipmentConfig,
  'equipment-statuses': equipmentStatusConfig,
  'verification-histories': verificationHistoryConfig
} as const;

export const reportConfigs = {
  'verifications-due': verificationDueReportConfig,
  'verifications-period': verificationPeriodReportConfig,
  'depreciation': depreciationReportConfig,
  'employees-report': employeeReportConfig,
  'departments-report': departmentReportConfig,
} as const;

export type ReportConfigKey = keyof typeof reportConfigs;

export type ResourceName = keyof typeof resourceConfigs;
