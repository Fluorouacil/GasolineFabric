// src/core/templates/ListTemplate.tsx
import { List, useTable, DateField } from "@refinedev/antd";
import { Table, Space, Button, Tag } from "antd";
import { ResourceConfig } from "../resources";
import { UUID } from "../types";

interface ListTemplateProps<T> {
    config: ResourceConfig<T>;
}

export const ListTemplate = <T extends { id: UUID }>({
    config,
}: ListTemplateProps<T>) => {
    const { tableProps } = useTable<T>({
        syncWithLocation: true,
    });

    const renderValue = (field: any, value: any, record: T) => {
        if (field.type === "date") {
            return <DateField value={value} format="DD.MM.YYYY" />;
        }
        if (field.type === "radio") {
            const opt = field.options?.find((o: any) => o.value === value);
            return opt ? <Tag>{opt.label}</Tag> : value;
        }
        if (field.type === "uuid-select") {
            // например, для person_uuid → ищем `person` в record
            const relatedKey = field.resource?.toLowerCase();
            if (relatedKey && record[relatedKey as keyof T]) {
                const related = record[relatedKey as keyof T] as any;
                return field.optionLabel?.(related) || related.id;
            }
            return value;
        }
        return value || "—";
    };

    const columns = config.listColumns
        ? config.listColumns.map((key) => {
              const field = config.fields.find((f) => f.name === key);
              return {
                  dataIndex: key,
                  title: field?.label || String(key),
                  render: (value: any, record: T) =>
                      field ? renderValue(field, value, record) : value,
              };
          })
        : config.fields.map((field) => ({
              dataIndex: field.name,
              title: field.label,
              render: (value: any, record: T) => renderValue(field, value, record),
          }));

    return (
        <List>
            <Table
                {...tableProps}
                rowKey="id"
                columns={[
                    ...columns,
                    {
                        title: "Действия",
                        render: (_: any, record: T) => (
                            <Space>
                                <Button size="small" href={`/${config.name}/show/${record.id}`}>
                                    Просмотр
                                </Button>
                                <Button size="small" href={`/${config.name}/edit/${record.id}`}>
                                    Ред.
                                </Button>
                            </Space>
                        ),
                    },
                ]}
            />
        </List>
    );
};