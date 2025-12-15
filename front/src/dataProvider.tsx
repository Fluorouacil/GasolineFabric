// src/providers/dataProvider.ts
import { DataProvider } from "@refinedev/core";

const API_URL = "http://localhost:8080";

export const dataProvider: DataProvider = {
    getList: async ({ resource, pagination, filters, sorters }) => {
        const { currentPage = 1, pageSize = 10 } = pagination ?? {};

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;

        const params = new URLSearchParams();
        params.append("_start", String(start));
        params.append("_end", String(end));

        if (sorters && sorters.length > 0) {
            params.append("_sort", sorters[0].field);
            params.append("_order", sorters[0].order);
        }

        if (filters) {
            filters.forEach((filter: any) => {
                if ("field" in filter && filter.value !== undefined) {
                    params.append(filter.field, String(filter.value));
                }
            });
        }

        const response = await fetch(`${API_URL}/${resource}?${params}`);
        const json = await response.json();

        if (json && typeof json === 'object' && 'data' in json && Array.isArray(json.data)) {
            return {
                data: json.data,
                total: json.total || json.data.length,
                ...json
            } as any;
        }

        if (Array.isArray(json)) {
            const totalStr = response.headers.get("X-Total-Count");
            const total = totalStr ? parseInt(totalStr, 10) : json.length;

            return {
                data: json,
                total: total,
            };
        }

        return {
            data: [],
            total: 0,
        };
    },

    getOne: async ({ resource, id }) => {
        const response = await fetch(`${API_URL}/${resource}/${id}`);
        const data = await response.json();
        return { data };
    },

    getMany: async ({ resource, ids }) => {
        if (!ids || ids.length === 0) return { data: [] };
        const params = ids.map(id => `id=${id}`).join("&");
        const response = await fetch(`${API_URL}/${resource}?${params}`);
        const json = await response.json();

        let result: any[];
        if (json && Array.isArray(json.data)) {
            result = json.data;
        } else if (Array.isArray(json)) {
            result = json;
        } else {
            result = [];
        }
        return { data: result };
    },

    create: async ({ resource, variables }) => {
        const response = await fetch(`${API_URL}/${resource}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(variables),
        });
        const data = await response.json();
        return { data };
    },

    update: async ({ resource, id, variables }) => {
        const response = await fetch(`${API_URL}/${resource}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(variables),
        });
        const data = await response.json();
        return { data };
    },

    deleteOne: async ({ resource, id }) => {
        await fetch(`${API_URL}/${resource}/${id}`, { method: "DELETE" });
        return { data: { id } as any };
    },

    getApiUrl: () => API_URL,
};