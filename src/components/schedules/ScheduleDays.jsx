// src/components/schedules/ScheduleDays.jsx - UN BREAK POR LÍNEA (ilimitados)
import { useAdmin } from "../../contexts/AdminContext.jsx";
import { useDayShort } from "../../utils/dayMaster.js";

export default function ScheduleDays() {
  const { draftTenant, setDraftTenant } = useAdmin();
  const shortDays = useDayShort(draftTenant?.locale);

  if (!draftTenant)
    return <div className="p-12 text-center text-gray-400">Loading...</div>;

  const generalSchedule = draftTenant.general_schedule || [];

  // Slots 15 minutos: ['09:00', '09:15', '09:30', ..., '21:00']
  const timeSlots = [];
  for (let h = 9; h <= 21; h++) {
    for (let m = 0; m < 60; m += 15) {
      timeSlots.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
    }
  }

  // HANDLERS OPTIMIZADOS
  const updateScheduleItem = (index, field, value) => {
    setDraftTenant((prev) => ({
      ...prev,
      general_schedule: prev.general_schedule.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateBreak = (scheduleIndex, breakIndex, field, value) => {
    setDraftTenant((prev) => ({
      ...prev,
      general_schedule: prev.general_schedule.map((schedule, i) => {
        if (i !== scheduleIndex) return schedule;
        return {
          ...schedule,
          breaks: schedule.breaks.map((br, j) =>
            j === breakIndex ? { ...br, [field]: value } : br
          ),
        };
      }),
    }));
  };

  const deleteBreak = (scheduleIndex, breakIndex) => {
    setDraftTenant((prev) => ({
      ...prev,
      general_schedule: prev.general_schedule.map((schedule, i) => {
        if (i !== scheduleIndex) return schedule;
        return {
          ...schedule,
          breaks: schedule.breaks.filter((_, j) => j !== breakIndex),
        };
      }),
    }));
  };

  const toggleDayInSchedule = (index, day) => {
    setDraftTenant((prev) => ({
      ...prev,
      general_schedule: prev.general_schedule.map((item, i) => {
        if (i !== index) return item;
        const daysSet = new Set(item.days || []);
        if (daysSet.has(day)) daysSet.delete(day);
        else daysSet.add(day);
        return { ...item, days: Array.from(daysSet) };
      }),
    }));
  };

  const addScheduleItem = () => {
    setDraftTenant((prev) => ({
      ...prev,
      general_schedule: [
        ...prev.general_schedule,
        {
          days: [],
          start: "09:00",
          end: "18:00",
          rrule: "",
          breaks: [],
        },
      ],
    }));
  };

  const addBreakToSchedule = (scheduleIndex) => {
    setDraftTenant((prev) => ({
      ...prev,
      general_schedule: prev.general_schedule.map((schedule, i) => {
        if (i !== scheduleIndex) return schedule;
        return {
          ...schedule,
          breaks: [
            ...(schedule.breaks || []),
            {
              start: "12:00",
              end: "13:00",
              label: "Lunch",
            },
          ],
        };
      }),
    }));
  };

  const deleteScheduleItem = (index) => {
    setDraftTenant((prev) => ({
      ...prev,
      general_schedule: prev.general_schedule.filter((_, i) => i !== index),
    }));
  };

  // CALCULAR SLOTS DEL BLOQUE
  const getBlockTimeSlots = (schedule) => {
    const startIdx = timeSlots.indexOf(schedule.start);
    const endIdx = timeSlots.indexOf(schedule.end);
    return timeSlots.slice(startIdx, endIdx);
  };

  const getValidBreakEndSlots = (schedule, breakStart) => {
    const blockSlots = getBlockTimeSlots(schedule);
    const startIdx = blockSlots.indexOf(breakStart);
    return startIdx !== -1 ? blockSlots.slice(startIdx + 1) : [];
  };

  return (
    <div className="p-8 bg-white border border-gray-100 shadow-2xl lg:p-12 rounded-3xl">

      <div className="flex items-center justify-between pb-6 mb-10 border-b-4 border-blue-200">
        <h4 className="text-2xl font-black tracking-tight text-gray-900">
          📅 General Schedules
        </h4>
        <button
          onClick={addScheduleItem}
          className="px-6 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
        >
          + Add block
        </button>
      </div>

      <div className="space-y-6">
        {generalSchedule.map((schedule, index) => {
          const blockSlots = getBlockTimeSlots(schedule);

          return (
            <div key={index} className="group">
              {/* HEADER FRANJA */}
              <div className="overflow-hidden transition-all duration-300 border-2 border-blue-100 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:shadow-2xl hover:-translate-y-1 group-hover:border-blue-200">
                {/* LÍNEA 1: Block # + DELETE */}
                <div className="flex items-center justify-between p-4 px-6 border-b border-blue-200">
                  <div className="text-lg font-black text-blue-900">
                    Block {index + 1} (of {generalSchedule.length})
                  </div>
                  <button
                    onClick={() => deleteScheduleItem(index)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-red-600 bg-red-100 border border-red-200 rounded-lg hover:bg-red-200 hover:shadow-sm transition-all hover:scale-105"
                    title="Delete block"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m7-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 4h16"
                      />
                    </svg>
                    Delete block
                  </button>
                </div>

                {/* LÍNEA 2: 7 DÍAS */}
                <div className="px-6 py-3 border-b border-blue-150">
                  <div className="grid grid-cols-7 gap-2">
                    {shortDays.map(({ code, label }) => {
                      const isUsedBefore = generalSchedule
                        .slice(0, index)
                        .some((s) => s.days?.includes(code));
                      return (
                        <label
                          key={code}
                          className={`flex items-center justify-center p-2 rounded-lg hover:bg-white/70 transition-all h-14 cursor-pointer group-hover:scale-[1.02] ${
                            isUsedBefore ? "opacity-40 cursor-not-allowed" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={schedule.days?.includes(code)}
                            onChange={() => toggleDayInSchedule(index, code)}
                            disabled={isUsedBefore}
                            className="w-4 h-4 mr-2 text-blue-600 rounded focus:ring-blue-400"
                          />
                          <span className="text-xs font-bold tracking-wide uppercase">
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* LÍNEA 3: START → END + ADD BREAK */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-blue-150 bg-white/50">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                      From:
                    </label>
                    <select
                      value={schedule.start}
                      onChange={(e) =>
                        updateScheduleItem(index, "start", e.target.value)
                      }
                      className="w-24 px-3 py-2 font-mono text-sm tracking-wider bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <div className="text-xl font-black text-gray-500">→</div>
                    <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                      To:
                    </label>
                    <select
                      value={schedule.end}
                      onChange={(e) =>
                        updateScheduleItem(index, "end", e.target.value)
                      }
                      className="w-24 px-3 py-2 font-mono text-sm tracking-wider bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => addBreakToSchedule(index)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-700 bg-orange-100 border-2 border-orange-200 rounded-lg hover:bg-orange-200 hover:shadow-sm transition-all hover:scale-105"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add break
                  </button>
                </div>

                {/* LÍNEAS DINÁMICAS: 1 BREAK POR LÍNEA (ILIMITADOS) */}
                {schedule.breaks?.map((rest, breakIndex) => {
                  const validEndSlots = getValidBreakEndSlots(
                    schedule,
                    rest.start
                  );

                  return (
                    <div
                      key={breakIndex}
                      className="px-6 py-1 transition-all zzborder-t zzborder-orange-150 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 hover:bg-orange-50/70"
                    >
                      <div className="flex items-center justify-between h-10">
                        {/* MISMO ANCHO que START→END (w-24 x2 + gaps) */}
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-semibold text-orange-800 whitespace-nowrap">
                            Break:
                          </label>
                          <select
                            value={rest.start}
                            onChange={(e) =>
                              updateBreak(
                                index,
                                breakIndex,
                                "start",
                                e.target.value
                              )
                            }
                            className="w-24 px-3 py-2 font-mono text-sm tracking-wider bg-white border border-orange-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                          >
                            {blockSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                          {/* <div className="text-xl font-black text-orange-500">
                            →
                          </div> */}
                          <select
                            value={rest.end}
                            onChange={(e) =>
                              updateBreak(
                                index,
                                breakIndex,
                                "end",
                                e.target.value
                              )
                            }
                            className="w-24 px-3 py-2 font-mono text-sm tracking-wider bg-white border border-orange-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500"
                          >
                            {validEndSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* LABEL usa TODO el espacio restante */}
                        <input
                          value={rest.label}
                          onChange={(e) =>
                            updateBreak(
                              index,
                              breakIndex,
                              "label",
                              e.target.value
                            )
                          }
                          className="flex-1 ml-8 px-4 py-2 text-sm font-medium border border-orange-300 rounded-lg bg-white/80 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm truncate max-w-[300px]"
                          maxLength={20}
                          placeholder="break label (Lunch, Meeting, ...)"
                        />

                        {/* DELETE a la derecha */}
                        <button
                          onClick={() => deleteBreak(index, breakIndex)}
                          className="h-10 px-4 py-1 ml-4 text-sm font-semibold text-red-600 transition-all bg-red-100 border border-red-200 rounded-lg hover:bg-red-200 hover:shadow-sm hover:scale-105"
                          title="Delete break"
                        >
                          🗑️ break
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Sin breaks */}
                {(!schedule.breaks || schedule.breaks.length === 0) && (
                  <div className="px-6 py-1 text-center border-t border-gray-150 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
                    <div className="flex items-center justify-center text-sm font-medium text-gray-500 h-14">
                      Without configured breaks
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
