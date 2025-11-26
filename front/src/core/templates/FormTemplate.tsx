// src/core/templates/FormTemplate.tsx
import {
    useForm,
    useSelect,
    useApiUrl,
    useCustom,
} from "@refinedev/core";
import { Form, Input, InputNumber, Select, DatePicker, Radio, Space } from "antd";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect } from "react";
import { ResourceConfig } from "../resources";

interface FormTemplateProps<T> {
    config: ResourceConfig<T>;
    isEdit?: boolean;
}

export const FormTemplate = <T extends { id: string }>({
    config,
    isEdit = false,
}: FormTemplateProps<T>) => {
    const { formProps, saveButtonProps, queryResult } = useForm<T>({
        meta: {
            preload: config.preload,
        },
    });

    // Для редактирования — предзаполняем даты как Dayjs
    useEffect(() => {
        if (isEdit && queryResult?.data?.data) {
            const data = queryResult.data.data;
            const dateFields = config.fields
                .filter((f) => f.type === "date")
                .map((f) => f.name);
            const updatedValues = { ...data };
            dateFields.forEach((field) => {
                const val = data[field as keyof T];
                if (val && typeof val === "string") {
                    updatedValues[field as keyof T] = dayjs(val) as any;
                }
            });
            formProps.form?.setFieldsValue(updatedValues);
        }
    }, [queryResult?.data, isEdit]);

    return (
        <Form {...formProps} layout="vertical">
            {config.fields.map((field) => {
                const key = field.name as string;

                switch (field.type) {
                    case "text":
                        return (
                            <Form.Item
                                key={key}
                                label={field.label}
                                name={key}
                                rules={[
                                    ...(field.required ? [{ required: true }] : []),
                                    ...(field.rules || []),
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        );

                    case "textarea":
                        return (
                            <Form.Item
                                key={key}
                                label={field.label}
                                name={key}
                                rules={field.required ? [{ required: true }] : []}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        );

                    case "number":
                        return (
                            <Form.Item
                                key={key}
                                label={field.label}
                                name={key}
                                rules={[
                                    { required: field.required, type: "number" },
                                    ...(field.rules || []),
                                ]}
                            >
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        );

                    case "date":
                        return (
                            <Form.Item
                                key={key}
                                label={field.label}
                                name={key}
                                rules={field.required ? [{ required: true }] : []}
                                getValueProps={(value: string | Dayjs | null) => ({
                                    value: value ? dayjs(value) : null,
                                })}
                                getValueFromEvent={(date: Dayjs | null) =>
                                    date ? date.toISOString() : null
                                }
                            >
                                <DatePicker format={field.format || "DD.MM.YYYY"} />
                            </Form.Item>
                        );

                    case "radio":
                        return (
                            <Form.Item
                                key={key}
                                label={field.label}
                                name={key}
                                rules={field.required ? [{ required: true }] : []}
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

                    case "uuid-select":
                        const selectProps = useSelect({
                            resource: field.resource!,
                            optionLabel: field.optionLabel!,
                            pagination: { mode: "server" },
                        });
                        return (
                            <Form.Item
                                key={key}
                                label={field.label}
                                name={key}
                                rules={field.required ? [{ required: true }] : []}
                            >
                                <Select
                                    {...selectProps}
                                    showSearch
                                    placeholder={`Выберите ${field.label.toLowerCase()}`}
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        );

                    default:
                        return null;
                }
            })}
        </Form>
    );
};