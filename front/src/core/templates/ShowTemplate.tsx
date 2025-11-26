// src/core/templates/ShowTemplate.tsx
import { Show, DateField } from "@refinedev/antd";
import { Descriptions, Tag, Space } from "antd";
import { useShow } from "@refinedev/core";
import { ResourceConfig } from "../resources";

interface ShowTemplateProps<T> {
    config: ResourceConfig<T>;
}

export const ShowTemplate = <T extends { id: string }>({
    config,
}: ShowTemplateProps<T>) => {
    const { queryResult } = useShow<T>();
    const { data, isLoading } = queryResult;

    if (isLoading) return <>Загрузка...</>;

    const record = data?.data;

    const renderValue = (field: any, value: any) => {
        if (!value) return "—";
        if (field.type === "date") {
            return <DateField value={value} format="DD.MM.YYYY HH:mm" />;
        }
        if (field.type === "radio") {
            const opt = field.options?.find((o: any) => o.value === value);
            return opt ? <Tag color="blue">{opt.label}</Tag> : value;
        }
        if (field.type === "uuid-select") {
            // ищем связанную сущность: person_uuid → person
            const relatedKey = field.resource?.toLowerCase();
            if (relatedKey && record && record[relatedKey as keyof T]) {
                const related = record[relatedKey as keyof T] as any;
                return field.optionLabel?.(related) || related.id;
            }
        }
        return String(value);
    };

    return (
        <Show isLoading={isLoading}>
            <Descriptions
                title={`${config.label} #${record?.id.substring(0, 8)}`}
                column={1}
                bordered
            >
                {config.fields.map((field) => (
                    <Descriptions.Item key={field.name as string} label={field.label}>
                        {renderValue(field, record?.[field.name as keyof T])}
                    </Descriptions.Item>
                ))}
                <Descriptions.Item label="Создан">
                    <DateField value={record?.created_at} format="LLL" />
                </Descriptions.Item>
                <Descriptions.Item label="Обновлён">
                    <DateField value={record?.updated_at} format="LLL" />
                </Descriptions.Item>
            </Descriptions>
        </Show>
    );
};