import { createContext, useContext, useCallback } from "react";
import * as api from "../services/api.js";

const AdminContext = createContext();

export function AdminProvider({ children, value }) {
  const {
    tenant,
    draftTenant,
    isDirty,
    setTenant,
    setDraftTenant,
    setIsDirty,
  } = value;

  // It will be used by any tab that allows data modification
  const updateDraft = (updater) => {
    setDraftTenant(updater);
    setIsDirty(true);
  };

  // This fx only will be used by StickyTabs
  const onSave = async () => {
    try {
      const result = await api.updateMyGeneralWeek(draftTenant);
      setTenant(result.data);
      setDraftTenant(result.data);
      setIsDirty(false);
    } catch (error) {
      setDraftTenant(tenant);
      setIsDirty(false);
    }
  };

  // This fx only will be used by StickyTabs
  const onCancel = () => {
    setDraftTenant(tenant);
    setIsDirty(false);
  };

  return (
    <AdminContext.Provider
      value={{
        tenant,
        draftTenant,
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
