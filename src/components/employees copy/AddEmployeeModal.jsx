import { useState } from "react";

export default function AddEmployeeModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [allServices, setAllServices] = useState(true);
  const [schedule, setSchedule] = useState([
    { day: "Lunes", from: "10:00", to: "19:00", enabled: true },
    { day: "Martes", from: "10:00", to: "19:00", enabled: true },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit?.({
      name: name.trim(),
      phone: phone.trim() || null,
      allServices,
      schedule: schedule.filter((s) => s.enabled),
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40">
      <div className="w-full max-w-md p-4 bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-slate-900">Nuevo empleado</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-400 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-slate-700">
              Teléfono
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
            <span className="text-xs text-slate-700">
              Asignar todos los servicios
            </span>
            <button
              type="button"
              onClick={() => setAllServices((v) => !v)}
              className={[
                "flex h-5 w-9 items-center rounded-full border text-[10px] transition-colors",
                allServices
                  ? "border-emerald-500 bg-emerald-500 text-white justify-end"
                  : "border-slate-300 bg-white text-slate-400 justify-start",
              ].join(" ")}
            >
              <span className="w-3 h-3 mx-1 bg-white rounded-full" />
            </button>
          </div>

          {/* Horario mini (puedes modularizar luego) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-700">
                Horario
              </span>
            </div>
            <div className="space-y-1.5">
              {schedule.map((slot, idx) => (
                <div
                  key={slot.day}
                  className="flex items-center justify-between gap-1 px-2 py-1 border rounded-lg border-slate-100"
                >
                  <label className="flex items-center gap-1 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={slot.enabled}
                      onChange={(e) => {
                        const next = [...schedule];
                        next[idx] = {
                          ...slot,
                          enabled: e.target.checked,
                        };
                        setSchedule(next);
                      }}
                      className="w-3 h-3 rounded border-slate-300 text-slate-900"
                    />
                    {slot.day}
                  </label>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600">
                    <input
                      type="time"
                      value={slot.from}
                      onChange={(e) => {
                        const next = [...schedule];
                        next[idx] = { ...slot, from: e.target.value };
                        setSchedule(next);
                      }}
                      className="h-6 px-1 border rounded border-slate-200"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={slot.to}
                      onChange={(e) => {
                        const next = [...schedule];
                        next[idx] = { ...slot, to: e.target.value };
                        setSchedule(next);
                      }}
                      className="h-6 px-1 border rounded border-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-40"
              disabled={!name.trim()}
            >
              Crear empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
