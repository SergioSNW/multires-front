// src/components/admin/SchedulesTab.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
// import {
//   getMondayOfWeek,
//   addDays,
// } from "../../../../utils/reservas/scheduleUtils.js"; // ¿expones desde backend o duplicas en front?
import { getMondayOfWeek, addDays } from "../../utils/schedule.js";

import { updateTenantGeneralWeek } from "../../services/api.js";

const DAYS = [
  { key: "mon", label: "Monday", fcDow: 1 },
  { key: "tue", label: "Tuesday", fcDow: 2 },
  { key: "wed", label: "Wednesday", fcDow: 3 },
  { key: "thu", label: "Thursday", fcDow: 4 },
  { key: "fri", label: "Friday", fcDow: 5 },
  { key: "sat", label: "Saturday", fcDow: 6 },
  { key: "sun", label: "Sunday", fcDow: 0 },
];

export default function SchedulesTab({ tenant, employees, onTenantChange }) {
  const [generalWeek, setGeneralWeek] = useState({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("all");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setGeneralWeek(tenant?.general_week || {});
  }, [tenant?.general_week]);

  const handleDayChange = useCallback((dayKey, patch) => {
    setGeneralWeek((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], ...patch },
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!tenant?.id) return;

    setSaving(true);
    try {
      const updated = await updateTenantGeneralWeek(tenant.id, {
        general_week: generalWeek,
      });
      onTenantChange(updated);
    } catch (error) {
      console.error("Save schedule error:", error);
      alert("Failed to save schedule: " + error.message);
    } finally {
      setSaving(false);
    }
  }, [tenant?.id, generalWeek, onTenantChange]);

  const { resources, events } = useMemo(() => {
    const monday = getMondayOfWeek();
    const resources = employees.map((emp) => ({
      id: emp.id,
      title: emp.name,
    }));

    const events = [];
    DAYS.forEach((day) => {
      const cfg = generalWeek[day.key];
      if (!cfg?.enabled || !cfg.start || !cfg.end) return;

      const dayDate = addDays(monday, day.fcDow === 0 ? 6 : day.fcDow - 1);
      const [startHour, startMin] = cfg.start.split(":").map(Number);
      const [endHour, endMin] = cfg.end.split(":").map(Number);

      const start = new Date(
        dayDate.getFullYear(),
        dayDate.getMonth(),
        dayDate.getDate(),
        startHour,
        startMin
      );
      const end = new Date(
        dayDate.getFullYear(),
        dayDate.getMonth(),
        dayDate.getDate(),
        endHour,
        endMin
      );

      // Filter by selected employee or all
      const filteredEmployees =
        selectedEmployeeId === "all"
          ? employees
          : employees.filter((emp) => emp.id === selectedEmployeeId);

      filteredEmployees.forEach((emp) => {
        events.push({
          id: `${emp.id}-${day.key}`,
          resourceId: emp.id,
          start,
          end,
          display: "background",
          title: "Coverage",
          backgroundColor: "#3b82f6",
          borderColor: "#1d4ed8",
        });
      });
    });

    return { resources, events };
  }, [generalWeek, employees, selectedEmployeeId]);

  return (
    <div className="horarios-tab">
      <div className="schedule-editor">
        <h2>General Schedule</h2>

        <div className="days-grid">
          {DAYS.map(({ key, label, fcDow }) => {
            const cfg = generalWeek[key] || {};
            return (
              <div key={key} className="day-row">
                <label className="day-label">
                  <input
                    type="checkbox"
                    checked={cfg.enabled || false}
                    onChange={(e) =>
                      handleDayChange(key, {
                        enabled: e.target.checked,
                      })
                    }
                  />
                  {label}
                </label>
                <div className="time-inputs">
                  <input
                    type="time"
                    value={cfg.start || ""}
                    disabled={!cfg.enabled}
                    onChange={(e) =>
                      handleDayChange(key, {
                        start: e.target.value,
                      })
                    }
                  />
                  <span>–</span>
                  <input
                    type="time"
                    value={cfg.end || ""}
                    disabled={!cfg.enabled}
                    onChange={(e) =>
                      handleDayChange(key, {
                        end: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="save-schedule-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Schedule"}
        </button>

        <div className="employee-selector">
          <label>
            Employee:
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              <option value="all">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[resourceTimeGridPlugin]}
          initialView="resourceTimeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "resourceTimeGridWeek,dayGridWeek",
          }}
          resources={resources}
          events={events}
          allDaySlot={false}
          slotMinTime="06:00:00"
          slotMaxTime="23:00:00"
          height="600px"
          resourceAreaColumns={[{ field: "title", headerContent: "Employee" }]}
          resourceLabelContent={(arg) => arg.resource.title}
        />
      </div>
    </div>
  );
}
