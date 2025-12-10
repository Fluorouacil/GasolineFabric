// src/core/templates/ShowTemplate.tsx
import { Show, DateField } from "@refinedev/antd";
import { Descriptions, Tag, Spin } from "antd";
import { useShow } from "@refinedev/core";
import { useParams } from "react-router";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { ResourceConfig, FieldConfig } from "../resources";
import { dataProvider } from "../../dataProvider";

interface ShowTemplateProps<T> {
    config: ResourceConfig<T>;
}

export const ShowTemplate = <T extends { id?: string }>({
    config,
}: ShowTemplateProps<T>) => {
    const { uuid } = useParams<{ uuid: string }>();

    const { query } = useShow<T>({
        resource: config.name,
        id: uuid,
        meta: { preload: config.preload },
    });

    const { data: record, isLoading: isLoadingMain } = query;
    
    const uuidFields = useMemo(
        () =>
            config.fields.filter(
                (f): f is FieldConfig<T> & { type: "uuid-select"; resource: string } =>
                    f.type === "uuid-select" && !!f.resource
            ),
        [config.fields]
    );

    const relatedIdsToFetch = useMemo(() => {
        if (!record) return new Map<string, Set<string>>();

        const map = new Map<string, Set<string>>();

        uuidFields.forEach((field) => {
            const value = record[field.name as keyof T];
            if (typeof value === "string") {
                if (!map.has(field.resource)) map.set(field.resource, new Set());
                map.get(field.resource)!.add(value);
            }
        });

        return map;
    }, [record, uuidFields]);

    const relatedQueries = useQueries({
        queries: Array.from(relatedIdsToFetch.entries()).map(([resource, idsSet]) => {
            const ids = Array.from(idsSet);
            return {
                queryKey: ["related-show", resource, ids],
                queryFn: () => dataProvider.getMany({ resource, ids }),
                enabled: ids.length > 0,
                staleTime: 5 * 60 * 1000,
            };
        }),
    });

    const relatedDataMap = useMemo(() => {
        const map = new Map<string, Map<string, any>>();

        relatedQueries.forEach((query, index) => {
            const resource = Array.from(relatedIdsToFetch.keys())[index];
            if (!query.data?.data) return;

            if (!map.has(resource)) map.set(resource, new Map());
            const resourceMap = map.get(resource)!;

            query.data.data.forEach((item: any) => {
                if (item?.id) resourceMap.set(item.id, item);
            });
        });

        return map;
    }, [relatedQueries, relatedIdsToFetch]);

    const isLoadingRelated = relatedQueries.some((q) => q.isLoading);

    if (isLoadingMain) {
        return <Show isLoading={true}>Загрузка...</Show>;
    }

    if (!record) {
        return <Show>Запись не найдена</Show>;
    }

    const recordId = typeof record.id === "string" ? record.id : uuid;
    const shortId = recordId ? recordId.substring(0, 8) : "—";

    const renderValue = (field: FieldConfig<T>, value: any) => {
        if (value === null || value === undefined) return "—";

        switch (field.type) {
            case "date":
                return <DateField value={value} format="DD.MM.YYYY HH:mm" />;

            case "radio":
            case "status":
                const opt = field.options?.find((o) => o.value === value);
                return opt ? <Tag color="blue">{opt.label}</Tag> : "—";

            case "uuid-select": {
                if (typeof value !== "string") return "—";

                const resourceMap = relatedDataMap.get(field.resource);
                const relatedItem = resourceMap?.get(value);

                if (relatedItem) {
                    if (typeof field.optionLabel === "function") {
                        return field.optionLabel(relatedItem);
                    }
                    if (typeof field.optionLabel === "string") {
                        return relatedItem[field.optionLabel] ?? value;
                    }
                    return relatedItem.name || relatedItem.title || value;
                }

                return isLoadingRelated ? (
                    <Spin size="small" />
                ) : (
                    <Tag color="warning">{value.slice(0, 8)}...</Tag>
                );
            }

            case "money":
                return `${Number(value).toLocaleString("ru-RU")} ₽`;

            default:
                return String(value);
        }
    };

    return (
        <Show isLoading={isLoadingMain || isLoadingRelated}>
            <Descriptions
                title={`${config.label} #${shortId}`}
                column={1}
                bordered
            >
                {config.fields.map((field) => (
                    <Descriptions.Item
                        key={field.name as string}
                        label={field.label}
                    >
                        {renderValue(field, record[field.name as keyof T])}
                    </Descriptions.Item>
                ))}

                {record.created_at && (
                    <Descriptions.Item label="Создан">
                        <DateField value={record.created_at} format="LLL" />
                    </Descriptions.Item>
                )}

                {record.updated_at && (
                    <Descriptions.Item label="Обновлён">
                        <DateField value={record.updated_at} format="LLL" />
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Show>
    );
};