import { createContext, useContext, useCallback } from "react";
import * as api from "../services/api.js";

const AdminContext = createContext();

export function AdminProvider({ children, value }) {
  const {
    tenant,
    draftTenant,
    employees,
    draftEmployees,
    setTenant,
    isDirty,
    setDraftTenant,
    setEmployees,
    setDraftEmployees,
    setIsDirty,
  } = value;

  // It will be used by any tab that allows data modification
  // This fx only will be used by StickyTabs
  // const onSave = async () => {
  //   try {
  //     const result = await api.updateMyGeneralWeek(draftTenant);
  //     setTenant(result.data);
  //     setDraftTenant(result.data);
  //     setIsDirty(false);
  //   } catch (error) {
  //     setDraftTenant(tenant);
  //     setIsDirty(false);
  //   }
  // };

  // // This fx only will be used by StickyTabs
  // const onCancel = () => {
  //   setDraftTenant(tenant);
  //   setIsDirty(false);
  // };

  // UPDATE DRAFT - tenant O employees
  const updateDraft = (updater) => {
    if (updater.tenant || updater.draftTenant !== undefined) {
      setDraftTenant(updater.draftTenant || updater.tenant);
    }
    if (updater.draftEmployees !== undefined) {
      setDraftEmployees(updater.draftEmployees);
    }
    setIsDirty(true);
  };

  // SAVE - tenant + employees
  const onSave = async () => {
    try {
      // Save tenant (general)
      const tenantResult = await api.updateMyGeneralWeek(draftTenant);
      setTenant(tenantResult.data);
      setDraftTenant(tenantResult.data);

      // Save employees (nuevo endpoint)
      console.log(
        "Aqui falta montar la api para actualizar TODOS los empleados...",
        draftEmployees
      );
      // if (draftEmployees.length > 0 && draftEmployees.some((e) => e.isDirty)) {
      //   const employeesResult = await api.updateEmployees(draftEmployees);
      //   setEmployees(employeesResult.data);
      //   setDraftEmployees(
      //     employeesResult.data.map((e) => ({ ...e, isDirty: false }))
      //   );
      // }

      setIsDirty(false);
    } catch (error) {
      // Rollback
      setDraftTenant(tenant);
      setDraftEmployees(employees);
      setIsDirty(false);
    }
  };

  // CANCEL - rollback todo
  const onCancel = () => {
    setDraftTenant(tenant);
    setDraftEmployees(employees);
    setIsDirty(false);
  };

  return (
    <AdminContext.Provider
      value={{
        tenant,
        draftTenant,
        employees,
        draftEmployees,
        isDirty,
        updateDraft,
        onSave,
        onCancel,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be in AdminProvider");
  return context;
};
