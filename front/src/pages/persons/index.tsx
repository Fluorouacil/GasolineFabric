import React from "react";
import { Create, Edit, List, Show } from "@refinedev/antd";
import { resourceConfigs } from "../../core/resources";
import { FormTemplate } from "../../core/templates/FormTemplate";
import { ListTemplate } from "../../core/templates/ListTemplate";
import { ShowTemplate } from "../../core/templates/ShowTemplate";

const config = resourceConfigs.persons;

export const PersonsList = () => <ListTemplate config={config} />;
export const PersonsCreate = () => (
    <Create title="Новое физическое лицо">
        <FormTemplate config={config} />
    </Create>
);
export const PersonsEdit = () => (
    <Edit title="Редактирование физического лица">
        <FormTemplate config={config} isEdit />
    </Edit>
);
export const PersonsShow = () => <ShowTemplate config={config} />;