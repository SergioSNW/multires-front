export default function ScheduleDays() {
  return (
    <div className="p-8 bg-white border border-gray-100 shadow-2xl lg:p-12 rounded-3xl">
      <h3 className="pb-6 mb-10 text-3xl font-black text-gray-900 border-b-4 border-blue-200">
        📅 General Schedules zzz
      </h3>
      {/* 7 LÍNEAS DÍAS */}
      {/* 7 LÍNEAS DÍAS COMPACTAS */}
      <div className="space-y-3">
        {[
          {
            day: "MON",
            status: "open",
            from: "09:00",
            to: "19:00",
            rests: [{ start: "12:00", end: "13:00", label: "Lunch" }],
          },
          {
            day: "TUE",
            status: "open",
            from: "09:00",
            to: "19:00",
            rests: [],
          },
          {
            day: "WED",
            status: "open",
            from: "09:00",
            to: "19:00",
            rests: [
              { start: "14:00", end: "14:30", label: "Coffee" },
              { start: "16:00", end: "17:00", label: "Afternoon" },
            ],
          },
          {
            day: "THU",
            status: "open",
            from: "09:00",
            to: "19:00",
            rests: [],
          },
          {
            day: "FRI",
            status: "open",
            from: "09:00",
            to: "19:00",
            rests: [],
          },
          {
            day: "SAT",
            status: "closed",
            from: "09:00",
            to: "19:00",
            rests: [],
          },
          {
            day: "SUN",
            status: "closed",
            from: "09:00",
            to: "19:00",
            rests: [],
          },
        ].map(({ day, status, from, to, rests }) => (
          <div
            key={day}
            className="overflow-hidden transition-all duration-300 bg-white border border-gray-300 group rounded-xl hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100"
          >
            {/* LÍNEA BASE (compacta) */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center flex-1 min-w-0 gap-4">
                <div className="w-20 px-2 text-xl font-black text-center text-gray-900">
                  {day}
                </div>

                <div
                  className={`px-4 py-2 rounded-full font-semibold text-sm shadow-md transition-all duration-200 ${
                    status === "open"
                      ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-300"
                      : "bg-red-100 text-red-800 border-2 border-red-300"
                  }`}
                >
                  {status.toUpperCase()}
                </div>

                <div className="flex items-center flex-1 min-w-0 gap-4 ml-2 text-lg font-semibold text-gray-700">
                  <span className="text-gray-500 whitespace-nowrap">from</span>
                  <span className="px-3 py-1 text-center bg-gray-100 rounded-lg">
                    {from}
                  </span>
                  <span className="text-gray-500 whitespace-nowrap">to</span>
                  <span className="px-3 py-1 text-center bg-gray-100 rounded-lg">
                    {to}
                  </span>
                </div>
              </div>

              <button className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 whitespace-nowrap group-hover:scale-105">
                +Add rest
              </button>
            </div>

            {/* BREAKS COMPACTOS: 1 línea horizontal, DENTRO del cuadro */}
            {/* BREAKS COMPACTOS: Botón SIEMPRE dentro */}
            <div
              className={`overflow-hidden transition-all duration-300 border-t border-gray-200 max-h-0 group-hover:max-h-28 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3`}
            >
              <div className="mb-2">
                {rests.length === 0 ? (
                  <div className="py-2 text-sm italic text-center text-gray-500">
                    No rests scheduled
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {rests.map((rest, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-all text-xs"
                      >
                        <span className="font-mono font-semibold text-gray-800">
                          {rest.start}-{rest.end}
                        </span>
                        <span className="text-gray-700">{rest.label}</span>
                        <button className="text-xs font-bold text-red-500 hover:text-red-700">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* BOTÓN SIEMPRE DENTRO */}
              <button className="w-full py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-all shadow-sm">
                + Add rest
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
