// src/pages/admin/Schedules.jsx - FIX API RESPONSE + flatMap
import { useState, useEffect, useCallback, useMemo } from "react"; // ✅ useMemo
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Schedules() {
  const [employeesApi, setEmployeesApi] = useState(null); // ✅ Raw API response
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [viewMode, setViewMode] = useState("overview");
  const [slotMinutes, setSlotMinutes] = useState(15);
  const [tempStart, setTempStart] = useState("09:00");
  const [tempEnd, setTempEnd] = useState("19:00");
  const [loading, setLoading] = useState(true);

  // ✅ EXTRAE data[] del response paginado
  const employees = useMemo(() => {
    if (!employeesApi?.data || !Array.isArray(employeesApi.data)) return [];
    return employeesApi.data.filter((emp) => emp.scheduleRRule); // Solo con horarios
  }, [employeesApi]);

  useEffect(() => {
    fetch("/api/v1/employees", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Raw API:", data);
        setEmployeesApi(data); // ✅ Guarda response COMPLETO
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setEmployeesApi({ data: [] });
        setLoading(false);
      });
  }, []);

  // ✅ useMemo evita re-renders infinitos + safe flatMap
  const overviewEvents = useMemo(() => {
    return employees.flatMap((emp, index) => {
      if (!emp?.scheduleRRule) return [];

      const hoursMatch = emp.scheduleRRule.match(/BYHOUR=(\d+(?:,\d+)*)/);
      const hours = hoursMatch ? hoursMatch[1].split(",") : [];
      if (!hours.length) return [];

      const startHour = Math.min(...hours.map((h) => +h));
      const endHour = Math.max(...hours.map((h) => +h)) + 1;

      return [
        {
          id: `emp-${emp._id}`,
          title: `${emp.name} (${emp.role})`,
          start: `2026-01-22T${startHour.toString().padStart(2, "0")}:00:00`,
          end: `2026-01-22T${endHour.toString().padStart(2, "0")}:00:00`,
          backgroundColor: `hsl(${(index * 40) % 360}, 70%, 40%)`, // ✅ index directo
          textColor: "white",
          editable: false,
          extendedProps: { empId: emp._id, empName: emp.name },
        },
      ];
    });
  }, [employees]);

  const editEvents = useMemo(() => {
    const emp = employees.find((e) => e._id === selectedEmpId);
    if (!emp?.scheduleRRule) return [];

    const hoursMatch = emp.scheduleRRule.match(/BYHOUR=(\d+(?:,\d+)*)/);
    const hours = hoursMatch ? hoursMatch[1].split(",") : [];

    return hours.map((hour) => ({
      id: `edit-${selectedEmpId}-${hour}`,
      title: emp.name,
      start: `2026-01-22T${hour}:00:00`,
      end: `2026-01-22T${(+hour + 1).toString().padStart(2, "0")}:00:00`,
      backgroundColor: `hsl(200, 70%, 50%)`,
      textColor: "white",
      editable: true,
      extendedProps: { empId: selectedEmpId },
    }));
  }, [selectedEmpId, employees]);

  const getSlotOptions = (minutes) => {
    const opts = [];
    for (let m = 0; m < 60; m += minutes) {
      opts.push(m.toString().padStart(2, "0"));
    }
    return opts;
  };

  const handleEventChange = useCallback(
    async (info) => {
      const { empId } = info.event.extendedProps;
      const emp = employees.find((e) => e._id === empId);
      if (!emp) return;

      const newStart = info.event.start.toTimeString().slice(0, 5);
      const newEnd = info.event.end.toTimeString().slice(0, 5);

      const startHour = +newStart.slice(0, 2);
      const endHour = +newEnd.slice(0, 2);
      const hours = [];
      for (let h = startHour; h < endHour; h++) {
        hours.push(h.toString().padStart(2, "0"));
      }

      const newRRule = `FREQ=DAILY;BYHOUR=${hours.join(",")}`;

      try {
        const res = await fetch(`/api/v1/employees/${empId}`, {
          // ✅ /employees/:id (NO /schedule)
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ scheduleRRule: newRRule }), // ✅ Solo campo
        });

        if (res.ok) {
          const freshData = await fetch("/api/v1/employees", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const freshApi = await freshData.json();
          setEmployeesApi(freshApi);

          if (viewMode === "edit") {
            setTempStart(newStart);
            setTempEnd(newEnd);
          }
        }
      } catch (err) {
        console.error("Update failed:", err);
      }
    },
    [employees, selectedEmpId, viewMode]
  );

  const handleApply = useCallback(async () => {
    const empId = selectedEmpId;
    if (!empId) return;

    const startHour = +tempStart.slice(0, 2);
    const endHour = +tempEnd.slice(0, 2);
    const hours = [];
    for (let h = startHour; h < endHour; h++) {
      hours.push(h.toString().padStart(2, "0"));
    }

    const newRRule = `FREQ=DAILY;BYHOUR=${hours.join(",")}`;

    try {
      const res = await fetch(`/api/v1/employees/${empId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ scheduleRRule: newRRule }),
      });

      if (res.ok) {
        const freshData = await fetch("/api/v1/employees", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const freshApi = await freshData.json();
        setEmployeesApi(freshApi);
      }
    } catch (err) {
      console.error("Apply failed:", err);
    }
  }, [selectedEmpId, tempStart, tempEnd]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        Cargando horarios...
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="mb-6 text-3xl font-bold">
        Gestión de Horarios
        <span className="px-3 py-1 ml-4 text-sm text-blue-800 bg-blue-100 rounded-full">
          {employees.length} empleados
        </span>
      </h1>

      {/* DEBUG INFO */}
      <div className="p-3 mb-4 text-sm border-l-4 border-yellow-400 bg-yellow-50">
        <strong>Debug:</strong> API status: {employeesApi?.status}, Empleados
        con RRULE: {employees.length}/{employeesApi?.data?.length || 0}
      </div>

      <div className="flex gap-4 p-4 mb-6 rounded-lg bg-gray-50">
        <select
          value={slotMinutes}
          onChange={(e) => setSlotMinutes(+e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value={15}>Slots 15min</option>
          <option value={30}>Slots 30min</option>
          <option value={60}>Slots 60min</option>
        </select>

        {viewMode === "edit" && (
          <>
            <select
              value={tempStart}
              onChange={(e) => setTempStart(e.target.value)}
              className="w-20 px-3 py-2 border rounded"
            >
              {getSlotOptions(slotMinutes).map((m) => (
                <option key={m} value={`${m}:00`}>
                  {m}:00
                </option>
              ))}
            </select>
            {" → "}
            <select
              value={tempEnd}
              onChange={(e) => setTempEnd(e.target.value)}
              className="w-20 px-3 py-2 border rounded"
            >
              {getSlotOptions(slotMinutes).map((m) => (
                <option key={m} value={`${m}:00`}>
                  {m}:00
                </option>
              ))}
            </select>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setViewMode("overview");
                setSelectedEmpId("");
              }}
              className="px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Overview
            </button>
          </>
        )}
      </div>

      {viewMode === "overview" && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">Editar empleado:</label>
          <select
            value={selectedEmpId}
            onChange={(e) => {
              setSelectedEmpId(e.target.value);
              setViewMode("edit");
              const emp = employees.find((e2) => e2._id === e.target.value);
              if (emp) {
                setTempStart("09:00");
                setTempEnd("19:00");
              }
            }}
            className="w-64 px-4 py-2 border rounded"
          >
            <option value="">Selecciona...</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} - {emp.role} (
                {emp.scheduleRRule.match(/BYHOUR=(\d+)/)?.[1]?.split(",")
                  ?.length || 0}
                h)
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-hidden bg-white rounded-lg shadow">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
          initialView="timeGridDay"
          headerToolbar={{
            left: viewMode === "overview" ? "prev,next,today" : "prev,next",
            center: "title",
            right:
              viewMode === "overview"
                ? "dayGridMonth,timeGridWeek,timeGridDay"
                : "timeGridDay",
          }}
          events={viewMode === "overview" ? overviewEvents : editEvents}
          editable={viewMode === "edit"}
          eventDrop={viewMode === "edit" ? handleEventChange : undefined}
          eventResize={viewMode === "edit" ? handleEventChange : undefined}
          height="85vh"
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          weekends={false}
          slotDuration={`00:${slotMinutes.toString().padStart(2, "0")}:00`}
          snapDuration={`00:${slotMinutes.toString().padStart(2, "0")}:00`}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            omitZeroMinute: false,
          }}
          eventDisplay="block"
          eventTextColor="white"
          eventBorderColor="transparent"
        />
      </div>
    </div>
  );
}
