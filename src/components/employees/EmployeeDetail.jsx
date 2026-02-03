// src/components/employees/EmployeeDetail.jsx - REAL DATA FUNCIONAL
import { forwardRef } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import EmployeeCustomSchedule from "./EmployeeCustomSchedule";

const EmployeeDetail = forwardRef(({ selectedEmployeeId }, ref) => {
  const { draftEmployees } = useAdmin();  // ← REAL API data
  
  // ← _id MongoDB
  const employee = draftEmployees.find((e) => e._id === selectedEmployeeId);
  
  console.log('EmployeeDetail:', { selectedEmployeeId, found: !!employee });  // DEBUG
  console.log('Employee-concreto:', employee );  // DEBUG

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-full p-12 text-lg italic text-gray-500">
        Empleado no encontrado: {selectedEmployeeId}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="max-h-full p-6 overflow-y-auto border border-gray-100 shadow-2xl lg:p-8 bg-gradient-to-br from-white to-slate-50 rounded-3xl"
    >
      {/* CABECERA REAL */}
      <div className="flex items-start justify-between gap-6 pb-8 mb-8 border-b-2 border-gray-100">
        <div className="flex-1 min-w-0">
          <h2 className="mb-1 text-2xl font-bold leading-tight text-gray-900 lg:text-3xl">
            {employee.name}
          </h2>
          <div className="space-y-1">
            {/* Phone desde API? Añadir si existe */}
            <p className="text-lg font-semibold text-emerald-700">
              Role: {employee.role}
            </p>
            <p className="text-base text-gray-600">
              {employee.sw_general_schedule ? 'Horario general' : 'Custom'}
            </p>
          </div>
        </div>

        {/* BOTONES (futuro) */}
        <div className="flex flex-shrink-0 gap-2 -mt-2">
          <button className="p-3 text-orange-500 transition-all shadow-md hover:bg-orange-100 rounded-2xl hover:shadow-xl">
            ✏️
          </button>
          <button className="p-3 transition-all shadow-md text-rose-500 hover:bg-rose-100 rounded-2xl hover:shadow-xl">
            🗑️
          </button>
        </div>
      </div>

      {/* HORARIO */}
      {employee.sw_general_schedule ? (
        <div className="p-8 text-center text-emerald-600 bg-emerald-50 rounded-3xl">
          ✅ Usa horario general (RRULE: {employee.scheduleRRule})
        </div>
      ) : (
        <EmployeeCustomSchedule custom_schedule={employee.custom_schedule} />
      )}

      {/* VACACIONES */}
      {employee.custom_holidays?.length > 0 && (
        <div className="p-6 mt-6 border-2 shadow-lg bg-emerald-50 border-emerald-100 rounded-3xl">
          <h3 className="mb-4 text-xl font-bold text-emerald-900">
            Vacaciones específicas ({employee.custom_holidays.length})
          </h3>
          {employee.custom_holidays.map((holiday, i) => (
            <div key={i} className="p-4 mb-3 bg-white border shadow-sm rounded-2xl">
              {holiday.name || 'Vacaciones'} - {holiday.date || 'Sin fecha'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default EmployeeDetail;
