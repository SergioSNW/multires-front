// src/components/admin/SchedulesTab.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
// import FullCalendar from "@fullcalendar/react";
// import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import {
//   getMondayOfWeek,
//   addDays,
// } from "../../../../utils/reservas/scheduleUtils.js"; // ¿expones desde backend o duplicas en front?
// import { getMondayOfWeek, addDays } from "../../utils/schedule.js";
import { updateMyGeneralWeek } from "../../services/api.js";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// import { CalendarIcon } from '@heroicons/react/24/outline';

// const DAYS = [
//   { key: "mon", label: "Monday", fcDow: 1 },
//   { key: "tue", label: "Tuesday", fcDow: 2 },
//   { key: "wed", label: "Wednesday", fcDow: 3 },
//   { key: "thu", label: "Thursday", fcDow: 4 },
//   { key: "fri", label: "Friday", fcDow: 5 },
//   { key: "sat", label: "Saturday", fcDow: 6 },
//   { key: "sun", label: "Sunday", fcDow: 0 },
// ];

// src/components/admin/SchedulesTab.jsx

const DAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

// BLOQUE MINUTOS (configurable)
const BLOCK_MINUTES = 15; // 15, 30, 60

// Time slots múltiplos de BLOCK_MINUTES
const TIME_SLOTS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += BLOCK_MINUTES) {
    TIME_SLOTS.push(
      `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
    );
  }
}

function snapToBlock(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const snappedM = Math.round(m / BLOCK_MINUTES) * BLOCK_MINUTES;
  return `${h.toString().padStart(2, "0")}:${snappedM
    .toString()
    .padStart(2, "0")}`;
}

function parseScheduleDB(schedules) {
  const general_week = {
    mon: { enabled: false, start: "09:00", end: "18:00" },
    tue: { enabled: false, start: "09:00", end: "18:00" },
    wed: { enabled: false, start: "09:00", end: "18:00" },
    thu: { enabled: false, start: "09:00", end: "18:00" },
    fri: { enabled: false, start: "09:00", end: "18:00" },
    sat: { enabled: false, start: "09:00", end: "18:00" },
    sun: { enabled: false, start: "09:00", end: "18:00" },
  };

  // Mapa iCal → key frontend
  const DAY_REVERSE_MAP = {
    MO: "mon",
    TU: "tue",
    WE: "wed",
    TH: "thu",
    FR: "fri",
    SA: "sat",
    SU: "sun",
  };

  (schedules || []).forEach((schedule) => {
    schedule.days.forEach((day_ical) => {
      const day_key = DAY_REVERSE_MAP[day_ical];
      if (day_key) {
        general_week[day_key] = {
          enabled: true,
          start: schedule.start,
          end: schedule.end,
        };
      }
    });
  });

  return general_week;
}

function parseBreaksDB(breaks) {
  const breaksBis = (breaks || []).map((breakItem) => ({
    ...breakItem,
    day: breakItem.day_key,
    id: Date.now() + Math.random(),
  }));
  console.log("Breaks DB adaptado:", breaksBis);
  return breaksBis;
}

export default function SchedulesTab({ tenant, onTenantChange }) {
  const [generalWeek, setGeneralWeek] = useState({});
  const [breaks, setBreaks] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setGeneralWeek(parseScheduleDB(tenant?.general_schedule));
    setBreaks(parseBreaksDB(tenant?.general_breaks));
    setHolidays(parseHolidaysFromDB(tenant?.general_holidays));
  }, [tenant]);

  const addBreak = useCallback((dayKey) => {
    setBreaks((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        day: dayKey,
        start: snapToBlock("12:00"),
        end: snapToBlock("13:00"),
      },
    ]);
  }, []);

  const updateBreak = useCallback((id, field, value) => {
    const snapped = snapToBlock(value);
    setBreaks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: snapped } : b))
    );
  }, []);

  const deleteBreak = useCallback((id) => {
    setBreaks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const updateDaySchedule = useCallback((dayKey, field, value) => {
    const snapped = snapToBlock(value);
    setGeneralWeek((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: snapped,
      },
    }));
  }, []);

  const toggleDay = useCallback((dayKey) => {
    setGeneralWeek((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey]?.enabled,
      },
    }));
  }, []);

  const addHoliday = () => {
    setHolidays([
      ...holidays,
      {
        id: Date.now() + Math.random(),
        date: "",
        label: "",
        recurring: true,
      },
    ]);
  };

  const updateHoliday = (index, field, value) => {
    setHolidays(
      holidays.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  };

  const removeHoliday = (index) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateMyGeneralWeek({
        general_week: generalWeek,
        general_breaks: breaks,
        general_holidays: holidays.map(({ id, ...rest }) => rest)  // quita id UI
      });
      onTenantChange(result.data);
      console.log("✅ Schedule saved");
    } catch (error) {
      console.error("❌ Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const dayBreaks = useCallback(
    (dayKey) => breaks.filter((b) => b.day === dayKey),
    [breaks]
  );

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        height: "calc(100vh - 220px)",
        padding: "1rem 0",
      }}
    >
      {/* COLUMNA IZQUIERDA: Horario General */}
      <div
        style={{
          flex: 1,
          maxWidth: "50%",
          background: "#f8fafc",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            paddingBottom: "1rem",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.75rem", color: "#1f2937" }}>
            General Schedule
          </h2>
          <a
            href="#visual-view"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Visual View →
          </a>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {DAYS.map((day) => {
            const cfg = generalWeek[day.key] || { enabled: false };
            const dayBreaksList = dayBreaks(day.key);

            return (
              <div
                key={day.key}
                style={{
                  padding: "1.5rem 1.75rem",
                  border: "2px solid #f1f5f9",
                  borderRadius: "16px",
                  background: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {/* Header día */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "1.125rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={cfg.enabled}
                      onChange={() => toggleDay(day.key)}
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        accentColor: "#3b82f6",
                      }}
                    />
                    {day.label}
                  </label>

                  {cfg.enabled && (
                    <a
                      href="#"
                      onClick={() => addBreak(day.key)}
                      style={{
                        color: "#10b981",
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      + Add Rest
                    </a>
                  )}
                </div>

                {/* Horario día */}
                {cfg.enabled && (
                  <div
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "center",
                      padding: "1rem",
                      background: "#f1f5f9",
                      borderRadius: "12px",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.25rem",
                          fontWeight: 500,
                        }}
                      >
                        Start
                      </label>
                      <select
                        value={cfg.start || ""}
                        onChange={(e) =>
                          updateDaySchedule(day.key, "start", e.target.value)
                        }
                        style={{
                          padding: "0.75rem 1rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          background: "white",
                          minWidth: "100px",
                        }}
                      >
                        <option value="">--</option>
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    <span style={{ fontSize: "1.5rem", color: "#6b7280" }}>
                      ─
                    </span>

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.25rem",
                          fontWeight: 500,
                        }}
                      >
                        End
                      </label>
                      <select
                        value={cfg.end || ""}
                        onChange={(e) =>
                          updateDaySchedule(day.key, "end", e.target.value)
                        }
                        style={{
                          padding: "0.75rem 1rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          background: "white",
                          minWidth: "100px",
                        }}
                      >
                        <option value="">--</option>
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Descansos día */}
                {dayBreaksList.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom: "0.75rem",
                        color: "#374151",
                        fontSize: "0.95rem",
                      }}
                    >
                      Breaks ({dayBreaksList.length})
                    </div>
                    {dayBreaksList.map((breakItem) => (
                      <div
                        key={breakItem.id}
                        style={{
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                          padding: "0.75rem 1rem",
                          background: "#fef3c7",
                          borderRadius: "8px",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <select
                          value={breakItem.start}
                          onChange={(e) =>
                            updateBreak(breakItem.id, "start", e.target.value)
                          }
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            borderRadius: "6px",
                          }}
                        >
                          {TIME_SLOTS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>

                        <span
                          style={{
                            minWidth: "20px",
                            textAlign: "center",
                            color: "#6b7280",
                          }}
                        >
                          ─
                        </span>

                        <select
                          value={breakItem.end}
                          onChange={(e) =>
                            updateBreak(breakItem.id, "end", e.target.value)
                          }
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            borderRadius: "6px",
                          }}
                        >
                          {TIME_SLOTS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => deleteBreak(breakItem.id)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "#ef4444",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "bold",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>




        // Debajo de breaks section
<div className="p-4 mt-8 border-2 border-indigo-200 rounded-lg bg-indigo-50">
<h3 className="flex items-center">
<i className="w-5 h-5 mr-2 fas fa-calendar-alt"></i>
  General Holidays
</h3>
  
  <div className="space-y-3 overflow-y-auto max-h-48">
    {holidays.map((holiday, index) => (
      <div key={holiday.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm">
        {/* Fecha */}
        <input
          type="date"
          value={holiday.date}
          onChange={(e) => updateHoliday(index, 'date', e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          required
        />
        
        {/* Label */}
        <input
          type="text"
          value={holiday.label}
          placeholder="Christmas Day"
          onChange={(e) => updateHoliday(index, 'label', e.target.value)}
          className="p-2 border rounded-lg flex-2 focus:ring-2 focus:ring-indigo-500"
        />
        
        {/* Recurrente */}
        <label className="flex items-center gap-2 p-2 rounded bg-gray-50">
          <input
            type="checkbox"
            checked={holiday.recurring}
            onChange={(e) => updateHoliday(index, 'recurring', e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Annual</span>
        </label>
        
        {/* Remove */}
        <button
          type="button"
          onClick={() => removeHoliday(index)}
          className="p-2 text-red-500 transition rounded-lg hover:text-red-700 hover:bg-red-50"
        >
          ×
        </button>
      </div>
    ))}
  </div>
  
  <button
    type="button"
    onClick={addHoliday}
    className="w-full p-3 mt-4 font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
  >
    + Add Holiday
  </button>
</div>






        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "2px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "1rem 3rem",
              fontSize: "1.1rem",
              fontWeight: 600,
              background: saving ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
            }}
          >
            {saving ? "Saving..." : "💾 Save Schedule"}
          </button>
        </div>
      </div>

      {/* COLUMNA DERECHA: Reservada Visual View */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          background: "#f1f5f9",
          borderRadius: "16px",
          border: "2px dashed #cbd5e1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📊</div>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>
            Visual Coverage View
          </h3>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            FullCalendar preview
            <br />
            (Click "Visual View" to open)
          </p>
        </div>
      </div>
    </div>
  );

  function parseHolidaysFromDB(holidays) {
    return (holidays || []).map((h) => ({
      id: Date.now() + Math.random(),
      ...h, // date, label, recurring directo
    }));
  }
}
