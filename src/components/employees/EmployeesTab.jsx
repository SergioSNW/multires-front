// src/components/employees/EmployeesTab.jsx - PROPS CORRECTOS FUNCIONAL
import { useState, useEffect, useRef } from 'react';
import { useAdmin } from "../../contexts/AdminContext";
import styles from './EmployeesTab.module.css';
import EmployeeList from './EmployeeList';
import EmployeeDetail from './EmployeeDetail';

export default function EmployeesTab() {
  const { draftEmployees, updateDraft } = useAdmin();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const detailRef = useRef(null);

  // ← ARROW FUNCTIONS DIRECTAS (SIEMPRE función, SIN useCallback)
  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    if (detailRef.current) {
      detailRef.current.scrollTop = 0; // Reset scroll
    }
  };

  const updateEmployee = (employeeId, updates) => {
    const updatedEmployees = draftEmployees.map(emp => 
      emp.id === employeeId ? { ...emp, ...updates } : emp
    );
    updateDraft({ draftEmployees: updatedEmployees });
  };

  // DEBUG - confirma funciones llegan
  console.log('EmployeesTab functions:', {
    employees: draftEmployees,
    hasOnSelect: typeof handleSelectEmployee === 'function',
    hasOnUpdate: typeof updateEmployee === 'function'
  });

  return (
    <div className={styles.tabContainer}>
      <div className={styles.listWrapper}>
        <EmployeeList 
          employees={draftEmployees.length > 0 ? draftEmployees : []}
          selectedEmployeeId={selectedEmployeeId}
          onSelectEmployee={handleSelectEmployee}  // ← PROP CLAVE
          onUpdateEmployee={updateEmployee}        // ← PROP CLAVE
        />
      </div>

      {/* console.log('Hover state:', { selectedEmployeeId }); */}
      
      {selectedEmployeeId && (
        <div className={styles.detailWrapper} ref={detailRef}>
          <button 
            onClick={() => setSelectedEmployeeId(null)}
            className="px-4 py-2 mb-4 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cerrar detalles
          </button>
          <EmployeeDetail selectedEmployeeId={selectedEmployeeId} />
        </div>
      )}
      
      {!selectedEmployeeId && (
        <div className={styles.emptyDetail}>Pasa el ratón sobre un empleado</div>
      )}
    </div>
  );
}
