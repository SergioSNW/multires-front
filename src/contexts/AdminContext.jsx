import { createContext, useContext, useCallback } from "react";
import * as api from "../services/api.js";
import { toast } from "react-hot-toast";

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

  // UPDATE DRAFTS: Tenant and Employees
  const updateDraftTenant = (updater) => {
    setDraftTenant(updater);
    setIsDirty(true);
  };

  const updateDraftEmployees = (updater) => {
    setDraftEmployees(updater);
    setIsDirty(true);
  };

  // SAVE - tenant + employees
  const onSave = async () => {
    try {
      // Save tenant (general)
      const tenantResult = await api.updateMyGeneralWeek(draftTenant);
      // setTenant(tenantResult.data);
      // setDraftTenant(tenantResult.data);

      console.log("llamando a bulk con... ", draftEmployees);

      // Employees BULK
      const employeesResult = await api.bulkUpdateEmployees(draftEmployees); // ← Nuevo endpoint
      console.log("recibido de bulk... ", employeesResult);

      // Sync state
      setTenant(draftTenant);
      setEmployees(draftEmployees);
      setDraftTenant(draftTenant);
      setDraftEmployees(draftEmployees);
      setIsDirty(false);

      toast.success("Guardado correctamente");

      // if (draftEmployees.length > 0 && draftEmployees.some((e) => e.isDirty)) {
      //   const employeesResult = await api.updateEmployees(draftEmployees);
      //   setEmployees(employeesResult.data);
      //   setDraftEmployees(
      //     employeesResult.data.map((e) => ({ ...e, isDirty: false }))
      //   );
      // }

    } catch (error) {
      toast.error("❌ Error al guardar empleados");
      console.error(error);
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
        updateDraftTenant,
        updateDraftEmployees,
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
