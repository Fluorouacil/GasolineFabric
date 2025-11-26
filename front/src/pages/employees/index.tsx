import React from "react";
import { Create, Edit, List, Show } from "@refinedev/antd";
import { resourceConfigs } from "../../core/resources";
import { FormTemplate } from "../../core/templates/FormTemplate";
import { ListTemplate } from "../../core/templates/ListTemplate";
import { ShowTemplate } from "../../core/templates/ShowTemplate";

const config = resourceConfigs.employees;

export const EmployeesList = () => <ListTemplate config={config} />;
export const EmployeesCreate = () => (
    <Create title="Новый сотрудник">
        <FormTemplate config={config} />
    </Create>
);
export const EmployeesEdit = () => (
    <Edit title="Редактирование сотрудника">
        <FormTemplate config={config} isEdit />
    </Edit>
);
export const EmployeesShow = () => <ShowTemplate config={config} />;