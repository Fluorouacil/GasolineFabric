import React from 'react';

import { Create, Edit, List, Show } from '@refinedev/antd';

import { resourceConfigs } from '../../core/resources';
import { FormTemplate } from '../../core/templates/FormTemplate';
import { ListTemplate } from '../../core/templates/ListTemplate';
import { ShowTemplate } from '../../core/templates/ShowTemplate';

const config = resourceConfigs['verification-histories'];

export const VerificationHistoriesList = () => <ListTemplate config={config} />;
export const VerificationHistoriesCreate = () => (
    <FormTemplate config={config} />
);
export const VerificationHistoriesEdit = () => (
    <FormTemplate config={config} isEdit />
);
export const VerificationHistoriesShow = () => <ShowTemplate config={config} />;
