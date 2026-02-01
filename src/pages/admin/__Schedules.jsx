import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Schedules() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [tempStart, setTempStart] = useState("09:00");
  const [tempEnd, setTempEnd] = useState("19:00");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("overview");

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

  // 🔑 1 BLOQUE COMPLETO por empleado (NO slots)
  const overviewEvents = employees
    .map((emp, i) => {
      const [startH] = emp.scheduleRRule
        .match(/BYHOUR=(\d+)/)?.[1]
        .split(",") || ["09"];
      const hoursCount =
        emp.scheduleRRule.match(/BYHOUR=(\d+(?:,\d+)*)/)?.[1].split(",")
          .length || 10;
      const endH = (+startH + hoursCount).toString().padStart(2, "0");

      return [
        {
          id: `ov-${emp._id}`,
          title: emp.name,
          startTime: `${startH}:00`,
          endTime: `${endH}:00`,
          backgroundColor: `hsl(${i * 40}, 70%, 25%)`,
          editable: false,
          extendedProps: { empId: emp._id },
        },
      ];
    })
    .flat();

  const editEvents = employees.find((e) => e._id === selectedEmpId)
    ? [
        {
          id: `ed-${selectedEmpId}`,
          title: employees.find((e) => e._id === selectedEmpId)?.name,
          startTime: tempStart,
          endTime: tempEnd,
          editable: true,
          extendedProps: { empId: selectedEmpId },
        },
      ]
    : [];

  const customButtons = {
    overviewBtn: { text: "👥 Todos", click: () => setViewMode("overview") },
    saveBtn: {
      text: "💾 Save",
      click: () => {
        fetchEmployees();
        setViewMode("overview");
      },
    },
  };

  const handleEditChange = useCallback(async (info) => {
    const empId = info.event.extendedProps.empId;
    const newStartHour = info.event.startStr.split("T")[1].slice(0, 2);
    const newEndHour = info.event.endStr.split("T")[1].slice(0, 2);

    const hours = [];
    for (let h = +newStartHour; h < +newEndHour; h++) {
      hours.push(h.toString().padStart(2, "0"));
    }

    const newRRule = `FREQ=DAILY;BYHOUR=${hours.join(",")}`;

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
      if (res.ok) {
        setTempStart(`${newStartHour}:00`);
        setTempEnd(`${newEndHour}:00`);
        fetchEmployees();
      } else {
        info.revert();
      }
    } catch (err) {
      info.revert();
    }
  }, []);

  const updateHours = useCallback(async () => {
    const startHour = tempStart.slice(0, 2);
    const endHour = tempEnd.slice(0, 2);
    const hours = [];
    for (let h = +startHour; h < +endHour; h++) {
      hours.push(h.toString().padStart(2, "0"));
    }
    const newRRule = `FREQ=DAILY;BYHOUR=${hours.join(",")}`;

    const token = localStorage.getItem("token");
    await fetch(`/api/v1/employees/${selectedEmpId}/schedule`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ scheduleRRule: newRRule }),
    });
    fetchEmployees();
  }, [selectedEmpId, tempStart, tempEnd]);

  if (loading)
    return <div className="p-8 text-xl text-center">Cargando horarios...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        {viewMode === "overview" ? "👥 Cobertura Diaria" : "✂️ Editar Horario"}
      </h1>

      {viewMode === "overview" ? (
        <select
          className="p-4 mb-8 text-lg bg-white border-2 border-blue-200 shadow-lg rounded-xl w-80"
          onChange={(e) => {
            if (e.target.value) {
              const emp = employees.find((e2) => e2._id === e.target.value);
              setTempStart("09:00"); // Default o emp.start
              setTempEnd("19:00");
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
      ) : (
        <div className="p-6 mb-8 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
          <div className="grid items-end grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Inicio
              </label>
              <input
                type="time"
                className="w-full p-3 bg-white border-2 border-blue-200 rounded-lg shadow-inner"
                value={tempStart}
                onChange={(e) => setTempStart(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Fin
              </label>
              <input
                type="time"
                className="w-full p-3 bg-white border-2 border-blue-200 rounded-lg shadow-inner"
                value={tempEnd}
                onChange={(e) => setTempEnd(e.target.value)}
              />
            </div>
            <button
              className="p-4 text-lg font-bold text-white transition-all shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:shadow-xl"
              onClick={updateHours}
            >
              ✅ Aplicar Horario
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white shadow-2xl rounded-2xl">
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
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          weekends={false}
          height="85vh"
          eventDisplay="block"
          eventTextColor="white"
          eventBorderColor="transparent"
        />
      </div>
    </div>
  );
}
