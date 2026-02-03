// src/components/employees/EmployeeList.jsx
import styles from "./EmployeeList.module.css";
// import mockEmployees from "./mockEmployees.js";
import { useAdmin } from "../../contexts/AdminContext.jsx";

export default function EmployeeList({ 
  employees,           // ← De context
  selectedEmployeeId, 
  onSelectEmployee, 
  onUpdateEmployee 
}) {
  return (
    <div className={styles.listContainer}>
      {employees.map((employee) => {  // ← employees dinámicos
        // Toggle schedule general/custom
        const toggleCustomSchedule = () => {
          onUpdateEmployee(employee.id, {
            schedule: employee.schedule === 'general' ? 'custom' : 'general'
          });
        };

        return (
                  // return (
          <div
            key={employee.id}
            onMouseEnter={() => onSelectEmployee(employee.id)}
            className={`${styles.employeeCard} ${styles.employeeCardHover} ${
              isSelected ? styles.employeeCardSelected : ""
            }`}
          >
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className={styles.avatarContainer}>
                <span className={styles.avatarText}>
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className={styles.infoSection}>
                <h3 className={styles.nameText}>{employee.name}</h3>
                <p className={styles.phoneText}>{employee.phone}</p>
              </div>

              {/* Flags */}
              {(hasCustomSchedule || hasExtraHolidays) && (
                <div className={styles.flagsContainer}>
                  {hasCustomSchedule && (
                    <span
                      className={`${styles.flagBadge} ${styles.flagCustom}`}
                    >
                      Custom Schedule
                    </span>
                  )}
                  {hasExtraHolidays && (
                    <span
                      className={`${styles.flagBadge} ${styles.flagHolidays}`}
                    >
                      {employee.holidays.length} Extra Holidays
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className={styles.underlineDivider} />
          </div>
        );
      })}
    </div>
  );
}
