// src/core/templates/FormTemplate.tsx
import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import { 
  DatePicker, 
  Form, 
  Input, 
  InputNumber, 
  Radio, 
  Select, 
  Spin 
} from 'antd';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { useForm, useSelect, Create, Edit } from '@refinedev/antd';
import { useOne } from '@refinedev/core';

export interface FieldConfig<T> {
  name: keyof T | string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'radio' | 'uuid-select';
  required?: boolean;
  rules?: any[];
  options?: { label: string; value: string | number }[];
  resource?: string;
  optionLabel?: string | ((item: any) => string);
  format?: string; 
}

export interface ResourceConfig<T> {
  name: string;
  label?: string;
  apiResource?: string;
  fields: FieldConfig<T>[];
}

interface FormTemplateProps<T> {
  config: ResourceConfig<T>;
  isEdit?: boolean;
}

export const FormTemplate = <T extends { id: string }>({
  config,
  isEdit = false,
}: FormTemplateProps<T>) => {
  const { uuid, id } = useParams<{ uuid?: string; id?: string }>();
  const recordId = uuid || id;

  const { formProps, saveButtonProps, formLoading } = useForm<T>({
    resource: config.apiResource || config.name,
    id: isEdit ? recordId : undefined,
    action: isEdit ? 'edit' : 'create',
    redirect: 'list',
  });

  const Wrapper = isEdit ? Edit : Create;

  const resourceLabel = config.label || config.name;
  const title = isEdit 
    ? `Редактирование: ${resourceLabel}` 
    : `Создание: ${resourceLabel}`;

  return (
    <Wrapper 
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
      title={title}
    >
      {formLoading && isEdit ? (
        <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
      ) : (
        <Form 
          {...formProps} 
          layout="vertical"
          onValuesChange={formProps.onValuesChange}
        >
          {config.fields.map((field) => {
            const key = field.name as string;

            switch (field.type) {
              case 'text':
                return (
                  <Form.Item
                    key={key}
                    label={field.label}
                    name={key}
                    rules={[
                      ...(field.required ? [{ required: true, message: `${field.label} обязательно` }] : []),
                      ...(field.rules || [])
                    ]}
                  >
                    <Input />
                  </Form.Item>
                );

              case 'textarea':
                return (
                  <Form.Item
                    key={key}
                    label={field.label}
                    name={key}
                    rules={field.required ? [{ required: true, message: `${field.label} обязательно` }] : []}
                  >
                    <Input.TextArea rows={3} />
                  </Form.Item>
                );

              case 'number':
                return (
                  <Form.Item
                    key={key}
                    label={field.label}
                    name={key}
                    rules={[
                      ...(field.required ? [{ required: true, type: 'number' as const, message: 'Введите число' }] : []),
                      ...(field.rules || [])
                    ]}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                );

              case 'date':
                return (
                  <Form.Item
                    key={key}
                    label={field.label}
                    name={key}
                    rules={field.required ? [{ required: true, message: 'Выберите дату' }] : []}
                    getValueProps={(value: string | Dayjs | null) => ({
                      value: value ? dayjs(value) : null,
                    })}
                    getValueFromEvent={(date: Dayjs | null) => 
                      date ? date.format('YYYY-MM-DD') : null
                    }
                  >
                    <DatePicker 
                      format={field.format || 'DD.MM.YYYY'} 
                      style={{ width: '100%' }} 
                    />
                  </Form.Item>
                );

              case 'radio':
                return (
                  <Form.Item
                    key={key}
                    label={field.label}
                    name={key}
                    rules={field.required ? [{ required: true, message: 'Выберите вариант' }] : []}
                  >
                    <Radio.Group>
                      {field.options?.map((opt) => (
                        <Radio key={opt.value} value={opt.value}>
                          {opt.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                );

              case 'uuid-select':
                return (
                  <UuidSelectField 
                    key={key} 
                    field={field} 
                    currentValue={
                       formProps.form?.getFieldValue(key) || 
                       formProps.initialValues?.[key]
                    } 
                  />
                );

              default:
                return null;
            }
          })}

        </Form>
      )}
    </Wrapper>
  );
};

interface UuidSelectFieldProps {
  field: FieldConfig<any>;
  currentValue?: string;
}

const UuidSelectField = ({ field, currentValue }: UuidSelectFieldProps) => {
  const { selectProps, queryResult: listQuery } = useSelect({
    resource: field.resource!,
    optionLabel: field.optionLabel as string,
    pagination: {
      mode: 'server',
      pageSize: 50, 
    },
    defaultValue: currentValue ? [currentValue] : [], 
  });

  const { data: currentItemData } = useOne({
    resource: field.resource!,
    id: currentValue!,
    queryOptions: {
      enabled: !!currentValue && !listQuery?.isLoading,
    },
  });

  const options = useMemo(() => {
    const listOptions = selectProps.options || [];

    const currentExists = listOptions.some(opt => opt.value === currentValue);

    if (!currentExists && currentValue && currentItemData?.data) {
      const item = currentItemData.data;

      let label: string;
      if (typeof field.optionLabel === 'function') {
        label = field.optionLabel(item);
      } else {
        label = String(item[field.optionLabel as keyof typeof item] || currentValue);
      }

      return [
        { value: currentValue, label },
        ...listOptions,
      ];
    }
    
    return listOptions;
  }, [selectProps.options, currentValue, currentItemData?.data, field.optionLabel]);

  return (
    <Form.Item
      label={field.label}
      name={field.name as string}
      rules={field.required ? [{ required: true, message: `${field.label} обязательно` }] : []}
    >
      <Select
        {...selectProps}
        options={options}
        showSearch
        allowClear
        placeholder={`Выберите ${field.label.toLowerCase()}`}
        filterOption={(input, option) =>
          (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
        }
      />
    </Form.Item>
  );
};