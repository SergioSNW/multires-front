import { forwardRef } from "react";

const EmployeeDetail = forwardRef(function EmployeeDetail(
  { employee, onEdit, onDelete },
  scrollRef
) {
  if (!employee) {
    return (
      <div
        ref={scrollRef}
        className="h-full px-4 py-3 overflow-y-auto text-sm text-slate-500"
      >
        Selecciona un empleado para ver el detalle
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full px-4 py-3 overflow-y-auto">
      {/* Header + acciones */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-medium text-slate-900">
            {employee.name}
          </h2>
          <p className="text-xs text-slate-500">{employee.phone}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit?.(employee)}
            className="inline-flex items-center px-2 py-1 text-xs bg-white border rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(employee)}
            className="inline-flex items-center px-2 py-1 text-xs text-red-600 border border-red-100 rounded-md bg-red-50 hover:bg-red-100"
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Schedule condicional */}
      {employee.schedule && employee.schedule.length > 0 && (
        <section className="mb-4">
          <h3 className="mb-1 text-xs font-medium tracking-wide uppercase text-slate-500">
            Horario
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {employee.schedule.map((slot) => (
              <li
                key={`${slot.day}-${slot.from}-${slot.to}`}
                className="flex items-center justify-between px-2 py-1 rounded-md bg-slate-50"
              >
                <span className="font-medium">{slot.day}</span>
                <span className="tabular-nums">
                  {slot.from} - {slot.to}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Servicios (ejemplo simple) */}
      {employee.services && employee.services.length > 0 && (
        <section className="mb-4">
          <h3 className="mb-1 text-xs font-medium tracking-wide uppercase text-slate-500">
            Servicios
          </h3>
          <div className="flex flex-wrap gap-1">
            {employee.services.map((service) => (
              <span
                key={service.id}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
              >
                {service.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

export default EmployeeDetail;
