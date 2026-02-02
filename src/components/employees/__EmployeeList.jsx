export default function EmployeeList({ employees, activeId, onHover }) {
  return (
    <div className="flex flex-col h-full min-h-0 p-6 bg-white border shadow-2xl border-slate-100 rounded-3xl lg:p-8">
      <div className="flex-1 mt-4 overflow-hidden">
        <div className="h-full pt-1 pb-24 pl-1 pr-4 space-y-4 overflow-y-auto">
          {employees.map((employee) => {
            const isActive = employee.id === activeId;
            return (
              <button
                key={employee.id}
                type="button"
                onMouseEnter={() => onHover?.(employee.id)}
                className={`
                  flex w-full items-center justify-between rounded-xl p-4 text-left transition-all duration-200 ring ring-slate-300/50
                  ${
                    isActive
                      ? "bg-gradient-to-r from-green-100 to-white shadow-lg"
                      : "bg-slate-50/50 hover:bg-white hover:shadow-md"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Icon with initials  */}
                  <div className="flex items-center justify-center w-12 h-12 shadow-sm rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                    <span className="text-sm font-bold text-slate-700">
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>

                  {/* Name and phone */}
                  <div>
                    <h3 className="text-base font-semibold leading-tight text-slate-900">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {employee.phone}
                    </p>
                  </div>
                </div>

                {/* BADGES. Only when is not the default (schedule and services) */}
                <div className="flex flex-col items-end gap-1">
                  {employee.schedule?.length > 0 && (
                    <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-bold bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 ring-1 ring-inset ring-orange-200/60 shadow-sm">
                      Custom Schedule
                    </span>
                  )}

                  {!employee.allServices && (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 ring-1 ring-inset ring-rose-200/60 shadow-sm">
                      Some Services
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
