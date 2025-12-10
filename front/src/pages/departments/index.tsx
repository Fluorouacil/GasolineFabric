import React from 'react';

import { Create, Edit, List, Show } from '@refinedev/antd';

import { resourceConfigs } from '../../core/resources';
import { FormTemplate } from '../../core/templates/FormTemplate';
import { ListTemplate } from '../../core/templates/ListTemplate';
import { ShowTemplate } from '../../core/templates/ShowTemplate';

const config = resourceConfigs.departments;

export const DepartmentsList = () => <ListTemplate config={config} />;
export const DepartmentsCreate = () => (
    <FormTemplate config={config} />
);
export const DepartmentsEdit = () => (
    <FormTemplate config={config} isEdit />
);
export const DepartmentsShow = () => <ShowTemplate config={config} />;
