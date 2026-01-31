import { useState } from "react";

export default function Holidays() {
  const [showModal, setShowModal] = useState(false);
  // ... tu state newHoliday

  return (
    <div className="p-8 border border-indigo-200 shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 lg:p-12 rounded-3xl">
      <h3 className="pb-6 mb-10 text-3xl font-black text-indigo-900 border-b-4 border-purple-200">
        🏖️ General Holidays
      </h3>

      <div className="mb-8 space-y-4">
        {[
          {
            id: 1,
            from: "25-Dec",
            to: "01-Jan",
            label: "Christmas",
            annual: true,
          },
          {
            id: 2,
            from: "15-Aug",
            to: "15-Aug",
            label: "Assumption",
            annual: true,
          },
          {
            id: 3,
            from: "28-Mar",
            to: "01-Apr",
            label: "Easter Week",
            annual: false,
          },
        ].map(({ id, from, to, label, annual }) => {
          const color = annual ? "emerald" : "orange";
          const badgeText = annual ? "Annual" : "2026";

          return (
            <div
              key={id}
              className={`group flex items-center justify-between p-6 transition-all border-2 rounded-2xl hover:shadow-xl bg-white/80 ${
                annual
                  ? "border-emerald-200 hover:border-emerald-400 shadow-emerald-100 hover:shadow-emerald-200"
                  : "border-orange-200 hover:border-orange-400 shadow-orange-100 hover:shadow-orange-200"
              }`}
            >
              <div className="flex items-center flex-1 gap-4">
                <div
                  className={`w-2 h-8 rounded-full ${
                    annual ? "bg-emerald-400" : "bg-orange-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="text-xl font-bold text-gray-900">
                      {label}
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        annual
                          ? "text-emerald-700 bg-emerald-100"
                          : "text-orange-700 bg-orange-100"
                      }`}
                    >
                      {badgeText}
                    </span>
                  </div>
                  <div
                    className={`text-lg font-semibold flex items-center gap-1 ${
                      annual ? "text-emerald-800" : "text-orange-800"
                    }`}
                  >
                    <span>{from}</span>
                    {from !== to && (
                      <>
                        <span className="text-2xl font-bold text-purple-500">
                          ➜
                        </span>
                        <span>{to}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100">
                <button className="p-2 text-indigo-600 transition-all hover:text-indigo-700 hover:bg-indigo-100 rounded-xl">
                  ✏️ Edit
                </button>
                <button className="p-2 text-red-600 transition-all hover:text-red-700 hover:bg-red-100 rounded-xl">
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="w-full p-6 text-xl font-bold text-white transition-all duration-300 shadow-xl bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl hover:shadow-2xl hover:-translate-y-1"
        onClick={() => setShowHolidayModal(true)}
      >
        + Add Holiday
      </button>
    </div>
  );
}
