// src/components/employees/EmployeeList.jsx - COMPLETO FUNCIONAL
import styles from './EmployeeList.module.css';
import mockEmployees from "./mockEmployees.js";

export default function EmployeeList({ 
  employees,  // ← Context O mock fallback
  selectedEmployeeId, 
  onSelectEmployee, 
  onUpdateEmployee 
}) {


 // ← DEBUG
 console.log('EmployeeList props:', { 
  employees, 
  selectedEmployeeId, 
  hasOnSelect: typeof onSelectEmployee === 'function',
  hasOnUpdate: typeof onUpdateEmployee === 'function'
});



  const toggleScheduleType = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      onUpdateEmployee(employeeId, {
        schedule: employee.schedule === 'general' ? 'custom' : 'general',
        isDirty: true
      });
    }
  };

  return (
    <div className={styles.listContainer}>
      {employees.map((employee) => {
        const isSelected = employee.id === selectedEmployeeId;
        const hasCustomSchedule = employee.schedule !== "general";
        const hasExtraHolidays = employee.holidays?.length > 0;

        return (
          <div
            key={employee._id}
            onMouseEnter={() => onSelectEmployee(employee._id)}
            className={`${styles.employeeCard} ${styles.employeeCardHover} ${
              isSelected ? styles.employeeCardSelected : ''
            }`}
          >
            <div className="flex items-start justify-between gap-6">
              {/* Avatar + Info */}
              <div className="flex items-center flex-1 min-w-0 gap-6">
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

                {/* Nombre + Teléfono */}
                <div className={styles.infoSection}>
                  <h3 className={styles.nameText}>{employee.name}</h3>
                  <p className={styles.phoneText}>{employee.phone}</p>
                </div>
              </div>

              {/* Controles + Flags */}
              <div className="flex flex-col items-end flex-shrink-0 gap-2">
                {/* Toggle Schedule */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleScheduleType(employee.id);
                  }}
                  className="p-2 text-xs font-semibold transition-all rounded-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title={hasCustomSchedule ? "Switch to General" : "Set Custom Schedule"}
                >
                  {hasCustomSchedule ? (
                    <span className="px-3 py-1 text-blue-700 bg-blue-100 rounded-lg">
                      Custom
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-gray-500 bg-gray-100 rounded-lg">
                      General
                    </span>
                  )}
                </button>

                {/* Flags */}
                {hasExtraHolidays && (
                  <span className={`${styles.flagBadge} ${styles.flagHolidays}`}>
                    {employee.holidays.length} Holidays
                  </span>
                )}
              </div>
            </div>

            <div className={styles.underlineDivider} />
          </div>
        );
      })}
    </div>
  );
}
