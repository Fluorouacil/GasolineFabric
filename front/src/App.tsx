// App.tsx
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';

import { notification } from 'antd';

import { ErrorComponent, ThemedLayout } from '@refinedev/antd';
import { NotificationProvider, Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerBindings, { NavigateToResource } from '@refinedev/react-router';
import { dataProvider } from './dataProvider';

import {
  DepartmentsCreate,
  DepartmentsEdit,
  DepartmentsList,
  DepartmentsShow,
} from './pages/departments';
import { EmployeesCreate, EmployeesEdit, EmployeesList, EmployeesShow } from './pages/employees';
import { EquipmentCreate, EquipmentEdit, EquipmentList, EquipmentShow } from './pages/equipment';
import {
  EquipmentStatusesCreate,
  EquipmentStatusesEdit,
  EquipmentStatusesList,
  EquipmentStatusesShow,
} from './pages/equipment-statuses';
import {
  EquipmentTypesCreate,
  EquipmentTypesEdit,
  EquipmentTypesList,
  EquipmentTypesShow,
} from './pages/equipments-types';
import { PersonsCreate, PersonsEdit, PersonsList, PersonsShow } from './pages/persons';
import {
  VerificationHistoriesCreate,
  VerificationHistoriesEdit,
  VerificationHistoriesList,
  VerificationHistoriesShow,
} from './pages/verification-histories';
import { DepreciationReportList } from './pages/depreciation-report';
import { DepartmentReportList } from './pages/department-report';
import { EmployeeReportList } from './pages/employee-report';
import { EquipmentSummaryReport } from './pages/equipment-summary-report';
import { VerificationsDueList } from './pages/verification-due-list';
import { VerificationsPeriodList } from './pages/verification-period-list';
import BarChartOutlined from '@ant-design/icons/lib/icons/BarChartOutlined';

const notificationProvider: NotificationProvider = {
  open: ({ message, description, type }) => {
    switch (type) {
      case 'success':
        notification.success({ message, description });
        break;
      case 'error':
        notification.error({ message, description });
        break;
      case 'progress':
        break;
      default:
        notification.info({ message, description });
    }
  },
  close: (key) => notification.destroy(key),
};

export default function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider}
          routerProvider={routerBindings}
          notificationProvider={notificationProvider}
          resources={[
            {
              name: 'departments',
              list: '/departments',
              create: '/departments/create',
              edit: '/departments/edit/:uuid',
              show: '/departments/show/:uuid',
              meta: { label: 'Отделы' },
            },
            {
              name: 'persons',
              list: '/persons',
              create: '/persons/create',
              edit: '/persons/edit/:uuid',
              show: '/persons/show/:uuid',
              meta: { label: 'Физ. лица' },
            },
            {
              name: 'employees',
              list: '/employees',
              create: '/employees/create',
              edit: '/employees/edit/:uuid',
              show: '/employees/show/:uuid',
              meta: { label: 'Сотрудники' },
            },
            {
              name: 'equipment-types',
              list: '/equipment-types',
              create: '/equipment-types/create',
              edit: '/equipment-types/edit/:uuid',
              show: '/equipment-types/show/:uuid',
              meta: { label: 'Типы оборудования' },
            },
            {
              name: 'equipment',
              list: '/equipment',
              create: '/equipment/create',
              edit: '/equipment/edit/:uuid',
              show: '/equipment/show/:uuid',
              meta: { label: 'Оборудование' },
            },
            {
              name: 'equipment-statuses',
              list: '/equipment-statuses',
              create: '/equipment-statuses/create',
              edit: '/equipment-statuses/edit/:uuid',
              show: '/equipment-statuses/show/:uuid',
              meta: { label: 'Статусы оборудования' },
            },
            {
              name: 'verification-histories',
              list: '/verification-histories',
              create: '/verification-histories/create',
              edit: '/verification-histories/edit/:uuid',
              show: '/verification-histories/show/:uuid',
              meta: { label: 'История поверок' },
            },
            {
              name: 'reports',
              meta: { label: 'Отчёты', icon: <BarChartOutlined /> },
            },
            {
              name: 'reports/depreciation',
              list: '/reports/depreciation',
              meta: { label: 'Амортизация', parent: 'reports' },
            },
            {
              name: 'reports/employees',
              list: '/reports/employees',
              meta: { label: 'По сотрудникам', parent: 'reports' },
            },
            {
              name: 'reports/departments',
              list: '/reports/departments',
              meta: { label: 'По подразделениям', parent: 'reports' },
            },
            {
              name: 'reports/summary',
              list: '/reports/summary',
              meta: { label: 'Сводный отчёт', parent: 'reports' },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            <Route
              element={
                <ThemedLayout>
                  <Outlet />
                </ThemedLayout>
              }
            >
              {/* Departments */}
              <Route index element={<NavigateToResource resource="departments" />} />
              <Route path="departments">
                <Route index element={<DepartmentsList />} />
                <Route path="create" element={<DepartmentsCreate />} />
                <Route path="edit/:uuid" element={<DepartmentsEdit />} />
                <Route path="show/:uuid" element={<DepartmentsShow />} />
              </Route>

              {/* Persons */}
              <Route path="persons">
                <Route index element={<PersonsList />} />
                <Route path="create" element={<PersonsCreate />} />
                <Route path="edit/:uuid" element={<PersonsEdit />} />
                <Route path="show/:uuid" element={<PersonsShow />} />
              </Route>

              {/* Employees */}
              <Route path="employees">
                <Route index element={<EmployeesList />} />
                <Route path="create" element={<EmployeesCreate />} />
                <Route path="edit/:uuid" element={<EmployeesEdit />} />
                <Route path="show/:uuid" element={<EmployeesShow />} />
              </Route>

              {/* EquipmentTypes */}
              <Route path="equipment-types">
                <Route index element={<EquipmentTypesList />} />
                <Route path="create" element={<EquipmentTypesCreate />} />
                <Route path="edit/:uuid" element={<EquipmentTypesEdit />} />
                <Route path="show/:uuid" element={<EquipmentTypesShow />} />
              </Route>

              {/* Equipment */}
              <Route path="equipment">
                <Route index element={<EquipmentList />} />
                <Route path="create" element={<EquipmentCreate />} />
                <Route path="edit/:uuid" element={<EquipmentEdit />} />
                <Route path="show/:uuid" element={<EquipmentShow />} />
              </Route>

              {/* EquipmentStatuses */}
              <Route path="equipment-statuses">
                <Route index element={<EquipmentStatusesList />} />
                <Route path="create" element={<EquipmentStatusesCreate />} />
                <Route path="edit/:uuid" element={<EquipmentStatusesEdit />} />
                <Route path="show/:uuid" element={<EquipmentStatusesShow />} />
              </Route>

              {/* VerificationHistories */}
              <Route path="verification-histories">
                <Route index element={<VerificationHistoriesList />} />
                <Route path="create" element={<VerificationHistoriesCreate />} />
                <Route path="edit/:uuid" element={<VerificationHistoriesEdit />} />
                <Route path="show/:uuid" element={<VerificationHistoriesShow />} />
              </Route>

              <Route path="reports">
                <Route path="depreciation" element={<DepreciationReportList />} />
                <Route path="employees" element={<EmployeeReportList />} />
                <Route path="departments" element={<DepartmentReportList />} />
                <Route path="summary" element={<EquipmentSummaryReport />} />
              </Route>

              <Route path="*" element={<ErrorComponent />} />
            </Route>
          </Routes>
          <RefineKbar />
        </Refine>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}
