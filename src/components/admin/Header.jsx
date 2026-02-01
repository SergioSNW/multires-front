// src/components/schedules/Header.jsx
// import { useAdmin } from "../contexts/AdminContext";
import { useAdmin } from "../../contexts/AdminContext";

export default function Header() {
  const { tenant } = useAdmin();

  if (!tenant) {
    return (
      <div className="grid grid-cols-5 gap-6 p-6 border bg-slate-100 border-slate-200 rounded-t-2xl animate-pulse">
        {Array(5)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="h-6 bg-slate-200 rounded w-full max-w-[120px]"
            ></div>
          ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-[minmax(140px,auto)_auto_auto_auto_auto]
     gap-6 p-6 mb-0 bg-blue-200 border border-gray-400 rounded-t-2xl"
    >
      {/* name */}
      <div>
        <div className="text-xl font-bold text-gray-900">{tenant.name}</div>
      </div>

      {/* email + phone */}
      <div>
        <div className="font-semibold text-gray-900">{tenant.email}</div>
        <div className="font-semibold text-gray-900">{tenant.phone}</div>
      </div>

      {/* address */}
      <div>
        <div className="font-semibold text-gray-900">{tenant.address}</div>
      </div>

      {/* timezone */}
      <div className="text-right">
        <div className="inline-block px-3.5 py-1.5  text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
          <span className="mr-1">🌍</span>
          {tenant.timezone}
        </div>
      </div>

      {/* minutes_slot */}
      <div>
        <div className="text-lg font-bold text-emerald-600">
          ⏱️ {tenant.minutes_slot} min
        </div>
      </div>
    </div>
  );
}
