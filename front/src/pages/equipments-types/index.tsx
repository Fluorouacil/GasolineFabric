import React from 'react';

import { Create, Edit, List, Show } from '@refinedev/antd';

import { resourceConfigs } from '../../core/resources';
import { FormTemplate } from '../../core/templates/FormTemplate';
import { ListTemplate } from '../../core/templates/ListTemplate';
import { ShowTemplate } from '../../core/templates/ShowTemplate';

const config = resourceConfigs['equipment-types'];

export const EquipmentTypesList = () => <ListTemplate config={config} />;
export const EquipmentTypesCreate = () => (
    <FormTemplate config={config} />
);
export const EquipmentTypesEdit = () => (
    <FormTemplate config={config} isEdit />
);
export const EquipmentTypesShow = () => <ShowTemplate config={config} />;
