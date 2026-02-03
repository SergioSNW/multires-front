// file:27 - SOLO _id + Context
import styles from "./EmployeeList.module.css";

export default function EmployeeList({
  employees = [], // ← Real API fallback []
  selectedEmployeeId,
  onSelectEmployee,
  onUpdateEmployee,
}) {
  return (
    <div className={styles.listContainer}>
      {" "}
      {/* h-full pb-12 pr-4 overflow-y-auto */}
      {employees.map((employee) => {
        // ← employees real
        const isSelected = employee._id === selectedEmployeeId; // ← _id
        const hasCustomSchedule = !employee.sw_general_schedule; // ← API field
        const hasExtraHolidays = employee.custom_holidays?.length > 0;

        return (
          <div
            key={employee._id} // ← _id
            onMouseEnter={() => onSelectEmployee(employee._id)} // ← _id
            className={`
              ${styles.employeeCard}
              ${isSelected ? styles.employeeCardSelected : ""}
            `}
          >
            {/* Tu JSX intacto: avatar, name, badges... */}
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
                  <p className={styles.phoneText}>{employee.role}</p>
                  <p className={styles.phoneText}>{employee._id}</p>
                  <p className={styles.phoneText}>{employee.sw_general_schedule}</p>
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
                  title={
                    hasCustomSchedule
                      ? "Switch to General"
                      : "Set Custom Schedule"
                  }
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
                  <span
                    className={`${styles.flagBadge} ${styles.flagHolidays}`}
                  >
                    {employee.holidays.length} Holidays
                  </span>
                )}
              </div>
            </div>

            <div className={styles.underlineDivider} />

            {/* Badges API */}
            <div className="flex flex-col items-end gap-2">
              {hasCustomSchedule && (
                <span className={styles.customBadge}>Horario custom</span>
              )}
              {hasExtraHolidays && (
                <span className={styles.holidaysBadge}>
                  {employee.custom_holidays.length} vacaciones
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
