import React from 'react';

import { Create, Edit, List, Show } from '@refinedev/antd';

import { resourceConfigs } from '../../core/resources';
import { FormTemplate } from '../../core/templates/FormTemplate';
import { ListTemplate } from '../../core/templates/ListTemplate';
import { ShowTemplate } from '../../core/templates/ShowTemplate';

const config = resourceConfigs.employees;

export const EmployeesList = () => <ListTemplate config={config} />;
export const EmployeesCreate = () => (
    <FormTemplate config={config} />
);
export const EmployeesEdit = () => (
    <FormTemplate config={config} isEdit />
);
export const EmployeesShow = () => <ShowTemplate config={config} />;
