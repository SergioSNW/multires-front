import { useState, useEffect } from "react"; // ← ¡IMPORT!
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";

export default function Schedules() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/v1/employees", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        const calendarEvents = data.map((emp) => ({
          id: emp._id,
          title: `${emp.name} - ${emp.role}`,
          rrule: {
            freq: "weekly",
            byweekday: [1, 2, 3, 4, 5], // L-V
            until: "2026-12-31",
          },
          startTime: "09:00",
          endTime: "19:00",
          backgroundColor: "#3B82F6",
          borderColor: "#1E40AF",
          editable: true,
        }));
        setEvents(calendarEvents);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <h1 className="mb-12 text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text drop-shadow-lg">
        Horarios Empleados
      </h1>
      <div className="overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl border-white/50">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            rrulePlugin,
          ]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          events={events}
          editable={true}
          selectable={true}
          height="85vh"
          slotMinTime="08:00"
          slotMaxTime="21:00"
          weekends={false}
        />
      </div>
    </div>
  );
}
