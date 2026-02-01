// Schedules.jsx - UX TÚ
import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Schedules() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("overview");

  // 🔄 CARGAR DATOS
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/v1/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEmployees(data.data || []);
    setLoading(false);
  };

  // EVENTS OVERVIEW (todos, colores)
  const overviewEvents = employees
    .map((emp, i) => {
      const hours =
        emp.scheduleRRule.match(/BYHOUR=(\d+(?:,\d+)*)/)?.[1].split(",") || [];
      return hours.map((h) => ({
        id: `ov-${emp._id}-${h}`,
        title: emp.name,
        startTime: `${h.padStart(2, "0")}:00`,
        endTime: `${(+h + 1).toString().padStart(2, "0")}:00`,
        // backgroundColor: `hsl(${i * 40}, 70%, 55%)`, // Colores únicos
        backgroundColor: `hsl(${i * 40}, 70%, 25%)`, // Colores únicos
        editable: false, // Read-only
      }));
    })
    .flat();

  // EVENTS EDIT (solo 1)
  const editEvents =
    employees
      .find((e) => e._id === selectedEmpId)
      ?.scheduleRRule.match(/BYHOUR=(\d+(?:,\d+)*)/)?.[1]
      .split(",")
      ?.map((h) => ({
        id: `ed-${h}`,
        title: employees.find((e) => e._id === selectedEmpId)?.name,
        startTime: `${h.padStart(2, "0")}:00`,
        endTime: `${(+h + 1).toString().padStart(2, "0")}:00`,
        editable: true,
        extendedProps: { empId: selectedEmpId },
      })) || [];

  const customButtons = {
    overviewBtn: {
      text: "👥 Todos",
      click: () => setViewMode("overview"),
    },
    saveBtn: {
      text: "💾 Save",
      click: () => {
        fetchEmployees(); // Refresh
        setViewMode("overview");
      },
    },
  };

  const handleEditChange = useCallback(async (info) => {
    // Tu handleEventChange version anterior
    const empId = info.event.extendedProps.empId; // ← extendedProps!
    const newStartHour = info.event.startStr.split("T")[1].slice(0, 2);
    const newEndHour = info.event.endStr.split("T")[1].slice(0, 2);

    // Lista horas: 19,20 → 19h-20h
    const hours = [];
    for (let h = +newStartHour; h < +newEndHour; h++) {
      hours.push(h.toString().padStart(2, "0"));
    }

    const newRRule = `FREQ=DAILY;BYHOUR=${hours.join(",")}`;

    console.log("🆕 Nuevo RRULE:", newRRule); // ← Debug

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/v1/employees/${empId}/schedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scheduleRRule: newRRule }),
      });

      if (!res.ok) {
        info.revert();
        console.error("PUT fail");
        return;
      }

      console.log("✅ UPDATE OK");
      fetchEmployees(); // Refresh
    } catch (err) {
      info.revert();
      console.error("Error:", err);
    }
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-8 text-3xl font-bold">
        {viewMode === "overview" ? "👥 Cobertura Diaria" : "✂️ Editar Horario"}
      </h1>

      {/* SELECTOR */}
      {viewMode === "overview" && (
        <select
          className="p-3 mb-6 bg-white border-2 rounded-lg shadow-md"
          onChange={(e) => {
            if (e.target.value) {
              setSelectedEmpId(e.target.value);
              setViewMode("edit");
            }
          }}
        >
          <option value="">🔧 Selecciona empleado para editar...</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.role}) -{" "}
              {
                emp.scheduleRRule.match(/BYHOUR=(\d+(?:,\d+)*)/)?.[1].split(",")
                  .length
              }
              h
            </option>
          ))}
        </select>
      )}

      {/* CALENDAR */}
      <div className="overflow-hidden bg-white shadow-xl rounded-xl">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          headerToolbar={{
            left:
              viewMode === "overview"
                ? "custom:overviewBtn prev,next"
                : "custom:saveBtn prev,next",
            center: "title",
            right: "today",
          }}
          customButtons={customButtons}
          events={viewMode === "overview" ? overviewEvents : editEvents}
          eventDrop={viewMode === "edit" ? handleEditChange : null}
          eventResize={viewMode === "edit" ? handleEditChange : null}
          selectable={viewMode === "edit"}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          allDaySlot={false}
          weekends={false}
          height="80vh"
          eventDisplay="block"
        />
      </div>
    </div>
  );
}
