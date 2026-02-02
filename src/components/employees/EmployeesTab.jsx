// src/components/employees/EmployeesTab.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./EmployeesTab.module.css";
import EmployeeList from "./EmployeeList";
import EmployeeDetail from "./EmployeeDetail";

export default function EmployeesTab() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const detailRef = useRef(null);

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
  }, []);

  return (
    <div className={styles.tabContainer}>
      {/* Lista */}
      <div className={styles.listWrapper}>
        <EmployeeList
          selectedEmployeeId={selectedEmployeeId}
          onSelectEmployee={handleSelectEmployee}
        />
      </div>

      {/* Detail Desktop */}
      {selectedEmployeeId ? (
        <div className={styles.detailWrapper}>
          <EmployeeDetail
            ref={detailRef}
            selectedEmployeeId={selectedEmployeeId}
          />
        </div>
      ) : (
        <div className={styles.emptyDetail}>
          Hover an employee to see details
        </div>
      )}

      {/* Detail Móvil */}
      {isMobileDetailOpen && selectedEmployeeId && (
        <div className={styles.mobileDetailContainer}>
          <button
            className={styles.closeButton}
            onClick={handleCloseMobileDetail}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Close details
          </button>
          <EmployeeDetail
            ref={detailRef}
            selectedEmployeeId={selectedEmployeeId}
          />
        </div>
      )}
    </div>
  );
}
