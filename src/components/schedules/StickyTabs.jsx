export default function StickyTabs({
  activeTab = "schedule",
  onTabChange,
  onSave,
  isDirty,
}) {
  const tabs = [
    { id: "schedule", icon: "⏰", label: "Gral.Schedule" },
    { id: "employees", icon: "👤", label: "Employees" },
    { id: "services", icon: "✂️", label: "Services" },
    { id: "marketing", icon: "🎈", label: "Marketing" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="sticky top-0 z-40 bg-blue-300 border-b-2 border-gray-400 backdrop-blur-xl rounded-b-2xl">
      <div className="px-4 py-1">
        <div className="flex items-center justify-between">
          {/* Desktop: tabs completos */}
          <div className="hidden space-x-1 overflow-hidden md:flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-3 font-medium whitespace-nowrap rounded-xl shadow-sm transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-blue-700 bg-white border-2 border-blue-200 hover:bg-blue-50"
                    : "text-slate-600 bg-slate-50/50 hover:bg-white hover:text-slate-900"
                }`}
              >
                <span className="mr-1 text-sm">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Móvil: solo 2 tabs + hamburguesa */}
          {/* <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onTabChange("schedule")}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex-shrink-0 ${
                activeTab === "schedule"
                  ? "text-blue-700 bg-white border-2 border-blue-200 shadow-sm"
                  : "text-slate-600 bg-slate-50 hover:bg-white"
              }`}
            >
              ⏰ Schedule
            </button>
            <button
              onClick={() => onTabChange("employees")}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex-shrink-0 ${
                activeTab === "employees"
                  ? "text-blue-700 bg-white border-2 border-blue-200 shadow-sm"
                  : "text-slate-600 bg-slate-50 hover:bg-white"
              }`}
            >
              👤 Empleados
            <button className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm">
              ☰
            </button>
          </div> */}

          {/* Save/Cancel */}
          <div className="flex gap-2">
            <button
              disabled={!isDirty}
              className="px-4 py-2 text-sm font-medium bg-white border shadow-sm text-slate-700 border-slate-300 rounded-xl hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              onClick={onSave}
              disabled={!isDirty}
              className="px-4 py-2 text-sm font-bold text-white shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-xl hover:from-blue-700"
            >
              💾 Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="sticky top-0 z-40 bg-blue-100 border-b-2 border-blue-200 shadow-2xl backdrop-blur-xl rounded-b-2xl">
  //     <div className="px-4 py-4">
  //       <div className="flex items-center justify-between">
  //         <div className="flex space-x-1 overflow-x-auto">
  //           {tabs.map((tab) => (
  //             <button
  //               key={tab.id}
  //               onClick={() => onTabChange(tab.id)}
  //               className={`px-5 py-3 font-medium whitespace-nowrap rounded-lg shadow-sm transition-all ${
  //                 activeTab === tab.id
  //                   ? "text-blue-700 bg-white border border-blue-200 hover:bg-blue-50"
  //                   : "text-gray-600 bg-transparent hover:bg-gray-50"
  //               }`}
  //             >
  //               {tab.icon} {tab.label}
  //             </button>
  //           ))}
  //         </div>
  //         <div className="flex gap-3">
  //           <button className="px-6 py-1 font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
  //             Cancel
  //           </button>
  //           <button className="px-6 py-1 text-white shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-xl">
  //             💾 Save
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
