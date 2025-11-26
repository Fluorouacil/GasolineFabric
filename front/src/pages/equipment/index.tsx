import React from "react";
import { Create, Edit, List, Show } from "@refinedev/antd";
import { resourceConfigs } from "../../core/resources";
import { FormTemplate } from "../../core/templates/FormTemplate";
import { ListTemplate } from "../../core/templates/ListTemplate";
import { ShowTemplate } from "../../core/templates/ShowTemplate";

const config = resourceConfigs.equipment;

export const EquipmentList = () => <ListTemplate config={config} />;
export const EquipmentCreate = () => (
    <Create title="Новое оборудование">
        <FormTemplate config={config} />
    </Create>
);
export const EquipmentEdit = () => (
    <Edit title="Редактирование оборудования">
        <FormTemplate config={config} isEdit />
    </Edit>
);
export const EquipmentShow = () => <ShowTemplate config={config} />;