// import { createContext, useContext } from "react";

// const AdminContext = createContext();

// // --- El useAdmin solo expone:
// // 1. el tenant leido de la DB, no modificable
// // 2. una copia de tenant-DB como draftTenant que es la editable/modificable
// // 3. variable isDirty que indica si el draft ya no es como el original 
// // 4. employees, tambien leido de DB y que tendra el mismo comportamiento de arriba
// export function AdminProvider({
//   tenant,
//   draftTenant,
//   setDraftTenant,
//   isDirty,
//   employees,
//   children,
// }) {
//   return (
//     <AdminContext.Provider
//       value={{
//         tenant, 
//         draftTenant, 
//         setDraftTenant, 
//         isDirty, 
//         employees,
//       }}
//     >
//       {children}
//     </AdminContext.Provider>
//   );
// }

// export function useAdmin() {
//   const context = useContext(AdminContext);
//   if (!context) throw new Error("useAdmin must be inside AdminProvider");
//   return context;
// }


// src/contexts/AdminContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

export const AdminContext = createContext();

export function AdminProvider({ children, tenant, draftTenant: initialDraft, onDraftChange, onMarkDirty }) {
  const [draftTenant, setDraftTenantInternal] = useState(initialDraft || tenant);

  // ✅ Wrapper que marca dirty CADA cambio
  const setDraftTenant = useCallback((updater) => {
    setDraftTenantInternal(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      onDraftChange?.(next);  // Sube a Admin.jsx
      onMarkDirty?.();        // 🔥 Activa Save button
      return next;
    });
  }, [onDraftChange, onMarkDirty]);

  return (
    <AdminContext.Provider value={{ 
      tenant, 
      draftTenant, 
      setDraftTenant,  // ← Usa el wrapper
      employees: tenant.employees || [] 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin debe estar en AdminProvider');
  return context;
};
