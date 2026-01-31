// src/components/employees/EmployeesTab.jsx
import { useState, useRef, useCallback } from "react";
import EmployeeList from "./EmployeeList";
import EmployeeDetail from "./EmployeeDetail";
import mockEmployees from "./mockEmployees"; //--provisional

export default function EmployeesTab() {
  const [activeEmployeeId, setActiveEmployeeId] = useState(1);
  const detailRef = useRef(null);

  const activeEmployee =
    mockEmployees.find((e) => e.id === activeEmployeeId) || null;

  const handleHoverEmployee = useCallback((employeeId) => {
    setActiveEmployeeId(employeeId);
    if (detailRef.current) detailRef.current.scrollTop = 0;
  }, []);

  return (
    <div className="grid h-full grid-cols-[1.1fr_1.6fr] gap-6 lg:gap-8">
      <EmployeeList
        employees={mockEmployees}
        activeId={activeEmployeeId}
        onHover={handleHoverEmployee}
      />
      <EmployeeDetail
        ref={detailRef}
        employee={activeEmployee}
        onEdit={() => console.log("Edit")}
        onDelete={() => console.log("Delete")}
      />
    </div>
  );
}
