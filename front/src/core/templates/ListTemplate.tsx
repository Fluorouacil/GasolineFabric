// src/core/templates/ListTemplate.tsx
import { List, useTable, DateField, DeleteButton } from "@refinedev/antd";
import { Table, Space, Button, Tag, Spin } from "antd";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { ResourceConfig, FieldConfig } from "../resources";
import { UUID } from "../types";
import { dataProvider } from "../../dataProvider";

interface ListTemplateProps<T> {
    config: ResourceConfig<T>;
}

export const ListTemplate = <T extends { id: UUID }>({
    config,
}: ListTemplateProps<T>) => {
    const { tableProps, pagination } = useTable<T>({
        syncWithLocation: true,
    });

    const tableData: T[] = useMemo(() => {
        return Array.isArray(tableProps.dataSource) ? tableProps.dataSource : [];
    }, [tableProps.dataSource]);

    const uuidFields = useMemo(
        () => config.fields.filter(
            (f): f is FieldConfig<T> & { type: "uuid-select"; resource: string } =>
                f.type === "uuid-select" && !!f.resource
        ),
        [config.fields]
    );

    const resourceIdMap = useMemo(() => {
        const map = new Map<string, Set<string>>();

        uuidFields.forEach(field => {
            const resource = field.resource;
            if (!map.has(resource)) map.set(resource, new Set());

            tableData.forEach(record => {
                const value = record[field.name as keyof T];
                if (typeof value === "string") {
                    map.get(resource)!.add(value);
                }
            });
        });

        return map;
    }, [tableData, uuidFields]);

    const relatedQueries = useQueries({
        queries: Array.from(resourceIdMap.entries()).map(([resource, idSet]) => {
            const ids = Array.from(idSet);
            return {
                queryKey: ["related", resource, ids],
                queryFn: () => dataProvider.getMany({ resource, ids }),
                enabled: ids.length > 0,
                staleTime: 5 * 60 * 1000,
            };
        }),
    });

    const relatedDataMap = useMemo(() => {
        const map = new Map<string, Map<string, any>>();

        relatedQueries.forEach((query, index) => {
            const resource = Array.from(resourceIdMap.keys())[index];
            if (!query.data?.data) return;

            if (!map.has(resource)) map.set(resource, new Map());
            const resourceMap = map.get(resource)!;

            query.data.data.forEach((item: any) => {
                if (item?.id) {
                    resourceMap.set(item.id, item);
                }
            });
        });

        return map;
    }, [relatedQueries, resourceIdMap]);

    const isLoadingRelated = relatedQueries.some(q => q.isLoading);

    const renderValue = (field: FieldConfig<T>, value: any, record: T) => {
        switch (field.type) {
            case "date":
                return value ? <DateField value={value} format="DD.MM.YYYY" /> : "—";

            case "radio":
            case "status":
                const opt = field.options?.find(o => o.value === value);
                return opt ? <Tag>{opt.label}</Tag> : "—";

            case "uuid-select": {
                const uuid = record[field.name as keyof T] as string;
                if (!uuid) return "—";

                const resourceMap = relatedDataMap.get(field.resource);
                const relatedItem = resourceMap?.get(uuid);

                if (relatedItem) {
                    if (typeof field.optionLabel === "function") return field.optionLabel(relatedItem);
                    if (typeof field.optionLabel === "string") return relatedItem[field.optionLabel] ?? uuid;
                    return relatedItem.name || relatedItem.title || uuid;
                }

                return isLoadingRelated ? <Spin size="small" /> : <Tag color="warning">{uuid.slice(0, 8)}...</Tag>;
            }

            case "money":
                return value ? `${Number(value).toLocaleString("ru-RU")} ₽` : "—";

            case "array": {
                if (!value || !Array.isArray(value) || value.length === 0) {
                    return "—";
                }

                const displayValue = value
                    .map(item => {
                        if (typeof item === "object" && item !== null) {
                            return item.name || item.title || item.label || JSON.stringify(item);
                        }
                        return String(item);
                    })
                    .join(", ");

                return displayValue;
            }

            default:
                return value ?? "—";
        }
    };

    const columns = (config.listColumns ?? config.fields.map(f => f.name)).map(key => {
        const field = config.fields.find(f => f.name === key);
        return {
            title: field?.label || key,
            key,
            render: (_: any, record: T) =>
                field ? renderValue(field, record[field.name as keyof T], record) : "—",
        };
    });

    return (
        <List>
            <Table
                {...tableProps}
                rowKey="id"
                loading={tableProps.loading || isLoadingRelated}
                columns={[
                    ...columns,
                    {
                        title: "Действия",
                        key: "actions",
                        fixed: "right" as const,
                        width: 180,
                        render: (_: any, record: T) => (
                            <Space>
                                <Button size="small" href={`/${config.name}/edit/${record.id}`}>
                                    Ред.
                                </Button>
                                <DeleteButton
                                    size="small"
                                    recordItemId={record.id}
                                    resource={config.name}
                                    confirmTitle="Удалить запись?"
                                    confirmOkText="Да"
                                    confirmCancelText="Нет"
                                />
                            </Space>
                        ),
                    },
                ]}
            />
        </List>
    );
};