// src/components/employees/EmployeeCustomScheduleEditor.jsx
import { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../contexts/AdminContext";

export default function EmployeeCustomScheduleEditor({ 
  employeeId, 
  custom_schedule, 
  general_schedule,
  onUpdate 
}) {
  const { draftTenant, markDirty } = useContext(AdminContext);
  const minutes_slot = draftTenant?.minutes_slot || 30;
  
  const [localSchedule, setLocalSchedule] = useState(custom_schedule || []);
  const [errors, setErrors] = useState({});

  // Time options basados en minutes_slot
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * minutes_slot;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const validateSchedule = (schedule) => {
    const newErrors = {};

    schedule.forEach((block, index) => {
      // Validar end > start
      const startIdx = timeOptions.indexOf(block.start);
      const endIdx = timeOptions.indexOf(block.end);
      if (endIdx <= startIdx) {
        newErrors[`block-${index}-end`] = "End time must be after start time";
      }

      // Validar días dentro del general_schedule
      const generalDays = general_schedule?.flatMap(s => s.days) || [];
      const invalidDays = block.days.filter(day => !generalDays.includes(day));
      if (invalidDays.length > 0) {
        newErrors[`block-${index}-days`] = `Days must be within general schedule: ${invalidDays.join(', ')}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlockChange = (index, field, value) => {
    const newSchedule = [...localSchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    
    setLocalSchedule(newSchedule);
    
    // Auto-validar
    if (validateSchedule(newSchedule)) {
      onUpdate(newSchedule);
      markDirty();
    }
  };

  const addBlock = () => {
    const newSchedule = [...localSchedule, {
      days: [],
      start: "09:00",
      end: "18:00",
      rrule: "",
      breaks: []
    }];
    setLocalSchedule(newSchedule);
    onUpdate(newSchedule);
    markDirty();
  };

  const removeBlock = (index) => {
    const newSchedule = localSchedule.filter((_, i) => i !== index);
    setLocalSchedule(newSchedule);
    onUpdate(newSchedule);
    markDirty();
  };

  return (
    <div className="space-y-6">
      {localSchedule.map((block, blockIndex) => (
        <div key={blockIndex} className="relative p-6 border-2 border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl group">
          {/* Header block */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-blue-200">
            <h3 className="text-xl font-bold text-blue-900">
              Schedule Block {blockIndex + 1}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-xl">
                <span>{block.start}</span>
                <span>→</span>
                <span>{block.end}</span>
              </div>
              <button
                onClick={() => removeBlock(blockIndex)}
                className="p-2 transition-all text-rose-500 hover:bg-rose-100 rounded-xl hover:scale-105"
                title="Remove block"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Days selector */}
          <div className="mb-6">
            <label className="block mb-3 text-sm font-semibold text-blue-900">
              Days (within general schedule)
            </label>
            <div className="grid max-w-md grid-cols-4 gap-2">
              {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((day) => (
                <label key={day} className="flex items-center p-3 bg-white rounded-xl border-2 cursor-pointer hover:border-blue-300 transition-all group-hover:scale-[1.02]">
                  <input
                    type="checkbox"
                    checked={block.days.includes(day)}
                    onChange={(e) => {
                      const newDays = e.target.checked
                        ? [...block.days, day]
                        : block.days.filter((d) => d !== day);
                      handleBlockChange(blockIndex, "days", newDays);
                    }}
                    className="w-4 h-4 mr-3 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900 capitalize">{day}</span>
                </label>
              ))}
            </div>
            {errors[`block-${blockIndex}-days`] && (
              <p className="mt-2 text-sm text-red-600">{errors[`block-${blockIndex}-days`]}</p>
            )}
          </div>

          {/* Time selectors */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-900">Start Time</label>
              <select
                value={block.start}
                onChange={(e) => handleBlockChange(blockIndex, "start", e.target.value)}
                className="w-full p-3 border border-blue-300 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-blue-900">End Time</label>
              <select
                value={block.end}
                onChange={(e) => handleBlockChange(blockIndex, "end", e.target.value)}
                className="w-full p-3 border border-blue-300 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors[`block-${blockIndex}-end`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`block-${blockIndex}-end`]}</p>
              )}
            </div>
          </div>

          {/* Breaks editor (simplificado) */}
          <div>
            <label className="block mb-4 text-sm font-semibold text-blue-900">Breaks</label>
            {/* Aquí iría editor de breaks similar a ScheduleDays */}
            <div className="space-y-3">
              {block.breaks?.map((br, brIndex) => (
                <div key={brIndex} className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="font-medium">{br.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-800">{br.start}-{br.end}</span>
                </div>
              )) || <p className="text-sm italic text-gray-500">No breaks defined</p>}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addBlock}
        className="flex items-center justify-center w-full gap-2 p-4 font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Schedule Block
      </button>
    </div>
  );
}
