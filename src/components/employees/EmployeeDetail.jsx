// src/components/employees/EmployeeDetail.jsx - CABECERA SIMPLE
import { forwardRef } from "react";
import mockEmployees from "./mockEmployees.js";
import EmployeeCustomSchedule from "./EmployeeCustomSchedule";
// import EmployeeCustomScheduleEditor from "./EmployeeCustomScheduleEditor";

const EmployeeDetail = forwardRef(({ selectedEmployeeId }, ref) => {
  const employee = mockEmployees.find((e) => e.id === selectedEmployeeId);

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-full p-12 text-lg italic text-gray-500">
        Selecciona un empleado para ver detalles
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="max-h-full p-6 overflow-y-auto border border-gray-100 shadow-2xl lg:p-8 bg-gradient-to-br from-white to-slate-50 rounded-3xl"
    >
      {/* CABECERA + BOTONES EDIT/DELETE */}
      <div className="flex items-start justify-between gap-6 pb-8 mb-8 border-b-2 border-gray-100">
        <div className="flex-1 min-w-0">
          <h2 className="mb-1 text-2xl font-bold leading-tight text-gray-900 lg:text-3xl">
            {employee.name}
          </h2>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-emerald-700">
              {employee.phone}
            </p>
            {employee.email && (
              <p className="text-base text-gray-600 truncate">
                {employee.email}
              </p>
            )}
          </div>
        </div>

        {/* BOTONES EDIT/DELETE */}
        <div className="flex flex-shrink-0 gap-2 -mt-2">
          <button className="flex items-center justify-center p-3 text-orange-500 transition-all duration-200 shadow-md lg:p-4 hover:text-orange-600 hover:bg-orange-100 rounded-2xl hover:shadow-xl">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button className="flex items-center justify-center p-3 transition-all duration-200 shadow-md lg:p-4 text-rose-500 hover:text-rose-600 hover:bg-rose-100 rounded-2xl hover:shadow-xl">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* HORARIO PERSONALIZADO */}
      {employee.custom_schedule?.length > 0 ? (
        <>
          <div className="mb-4">
            <EmployeeCustomSchedule
              custom_schedule={employee.custom_schedule}
            />
          </div>
          {/* <EmployeeCustomScheduleEditor
            employeeId={employee.id}
            custom_schedule={employee.custom_schedule}
            general_schedule={draftTenant.general_schedule} // ← Validación
            onUpdate={(newSchedule) => {
              // Actualiza draftTenant.employee_custom_schedule
              updateDraft({
                ...draftTenant,
                [`employee_${employee.id}_custom_schedule`]: newSchedule,
              });
            }}
          /> */}
        </>
      ) : (
        <div className="p-8 text-center text-gray-500">
          No custom schedule
          {/* <EmployeeCustomScheduleEditor /> */}
        </div>
      )}
      {/* VACACIONES ESPECÍFICAS */}
      {employee.holidays?.length > 0 && (
        <div className="p-6 border-2 shadow-lg bg-emerald-50 border-emerald-100 rounded-3xl">
          <h3 className="flex items-center gap-3 mb-6 text-xl font-bold text-emerald-900">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            Vacaciones específicas ({employee.holidays.length})
          </h3>
          <div className="space-y-4">
            {employee.holidays.map((holiday, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 transition-all bg-white border shadow-sm rounded-2xl border-emerald-200 hover:shadow-md"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {holiday.name}
                  </h4>
                  <p className="text-sm text-gray-600">{holiday.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {holiday.days && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {holiday.days} días
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default EmployeeDetail;
