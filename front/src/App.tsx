// App.tsx
import { Refine, NotificationProvider } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { ThemedLayout, ErrorComponent } from "@refinedev/antd";
import { notification } from "antd";
import routerBindings, { NavigateToResource, CatchAllNavigate } from "@refinedev/react-router"
import dataProvider from "@refinedev/simple-rest";

import { BrowserRouter, Routes, Route, Outlet } from "react-router";

import { DepartmentsList, DepartmentsCreate, DepartmentsEdit, DepartmentsShow } from "./pages/departments";
import { PersonsList, PersonsCreate, PersonsEdit, PersonsShow } from "./pages/persons";
import { EmployeesList, EmployeesCreate, EmployeesEdit, EmployeesShow } from "./pages/employees";
import { EquipmentTypesList, EquipmentTypesCreate, EquipmentTypesEdit, EquipmentTypesShow } from "./pages/equipments-types";
import { EquipmentList, EquipmentCreate, EquipmentEdit, EquipmentShow } from "./pages/equipment";
import { EquipmentStatusesList, EquipmentStatusesCreate, EquipmentStatusesEdit, EquipmentStatusesShow } from "./pages/equipment-statuses";
import { VerificationHistoriesList, VerificationHistoriesCreate, VerificationHistoriesEdit, VerificationHistoriesShow } from "./pages/verification-histories";

const notificationProvider: NotificationProvider = {
    open: ({ message, description, type }) => {
        switch (type) {
            case "success":
                notification.success({ message, description });
                break;
            case "error":
                notification.error({ message, description });
                break;
            case "progress":
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
                    dataProvider={dataProvider("http://localhost:8080")} // ← твой Go backend
                    routerProvider={routerBindings}
                    notificationProvider={notificationProvider}
                    resources={[
                        {
                            name: "departments",
                            list: "/departments",
                            create: "/departments/create",
                            edit: "/departments/edit/:uuid",
                            show: "/departments/show/:uuid",
                            meta: { label: "Отделы" },
                        },
                        {
                            name: "persons",
                            list: "/persons",
                            create: "/persons/create",
                            edit: "/persons/edit/:uuid",
                            show: "/persons/show/:uuid",
                            meta: { label: "Физ. лица" },
                        },
                        {
                            name: "employees",
                            list: "/employees",
                            create: "/employees/create",
                            edit: "/employees/edit/:uuid",
                            show: "/employees/show/:uuid",
                            meta: { label: "Сотрудники" },
                        },
                        {
                            name: "equipment-types",
                            list: "/equipment-types",
                            create: "/equipment-types/create",
                            edit: "/equipment-types/edit/:uuid",
                            show: "/equipment-types/show/:uuid",
                            meta: { label: "Типы оборудования" },
                        },
                        {
                            name: "equipment",
                            list: "/equipment",
                            create: "/equipment/create",
                            edit: "/equipment/edit/:uuid",
                            show: "/equipment/show/:uuid",
                            meta: { label: "Оборудование" },
                        },
                        {
                            name: "equipment-statuses",
                            list: "/equipment-statuses",
                            create: "/equipment-statuses/create",
                            edit: "/equipment-statuses/edit/:uuid",
                            show: "/equipment-statuses/show/:uuid",
                            meta: { label: "Статусы оборудования" },
                        },
                        {
                            name: "verification-histories",
                            list: "/verification-histories",
                            create: "/verification-histories/create",
                            edit: "/verification-histories/edit/:uuid",
                            show: "/verification-histories/show/:uuid",
                            meta: { label: "История поверок" },
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

                            <Route path="*" element={<ErrorComponent />} />
                        </Route>
                    </Routes>
                    <RefineKbar />
                </Refine>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}