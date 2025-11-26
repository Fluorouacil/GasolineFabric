import React from "react";
import { Create, Edit, List, Show } from "@refinedev/antd";
import { resourceConfigs } from "../../core/resources";
import { FormTemplate } from "../../core/templates/FormTemplate";
import { ListTemplate } from "../../core/templates/ListTemplate";
import { ShowTemplate } from "../../core/templates/ShowTemplate";

const config = resourceConfigs["equipment-statuses"];

export const EquipmentStatusesList = () => <ListTemplate config={config} />;
export const EquipmentStatusesCreate = () => (
    <Create title="Новый статус оборудования">
        <FormTemplate config={config} />
    </Create>
);
export const EquipmentStatusesEdit = () => (
    <Edit title="Редактирование статуса оборудования">
        <FormTemplate config={config} isEdit />
    </Edit>
);
export const EquipmentStatusesShow = () => <ShowTemplate config={config} />;