// MAQUETA EXACTA + scrollTop=0 hover
import { useState, useEffect, useRef, useCallback } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import styles from "./EmployeesTab.module.css";
import EmployeeList from "./EmployeeList";
import EmployeeDetail from "./EmployeeDetail";

export default function EmployeesTab() {
  const { draftEmployees, updateDraft } = useAdmin();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const detailRef = useRef(null);
  const listRef = useRef(null);

  // ← SCROLL RESET detail al hover (tu magia)
  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.scrollTop = 0;
    }
  }, [selectedEmployeeId]);

  const handleSelectEmployee = useCallback((employeeId) => {
    setSelectedEmployeeId(employeeId);
    setIsMobileDetailOpen(true);
  }, []);

  const handleCloseMobileDetail = useCallback(() => {
    setIsMobileDetailOpen(false);
    setSelectedEmployeeId(null);
  }, []);

  const updateEmployee = useCallback(
    (employeeId, updates) => {
      const updated = draftEmployees.map((emp) =>
        emp._id === employeeId ? { ...emp, ...updates } : emp
      );
      updateDraft({ draftEmployees: updated });
    },
    [draftEmployees, updateDraft]
  );

  // Reemplaza flex → grid TU MAQUETA
  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 p-6 lg:p-8">
      {/* LISTA 1/3 */}
      <div className="min-h-0">
        <div 
          ref={listRef}
          className="h-[calc(100vh-6rem)] overflow-y-auto pb-12 pr-4"
        >
          <EmployeeList 
            employees={draftEmployees}
            selectedEmployeeId={selectedEmployeeId}
            onSelectEmployee={handleSelectEmployee}
            onUpdateEmployee={updateEmployee}
          />
        </div>
      </div>

      {/* DETAIL 2/3 - SIEMPRE VISIBLE */}
      <div className="min-h-0">
        <div 
          ref={detailRef}
          className="sticky top-6 h-[calc(100vh-6rem)] overflow-y-auto p-8 rounded-3xl bg-gradient-to-br from-slate-50/50 to-transparent"
        >
          {selectedEmployeeId ? (
            <EmployeeDetail selectedEmployeeId={selectedEmployeeId} />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] text-gray-500 text-xl italic p-12 border-4 border-dashed border-gray-200 rounded-3xl backdrop-blur-sm">
              ✨ Pasa el ratón sobre un empleado
            </div>
          )}
        </div>
      </div>
    </div>
  );}
