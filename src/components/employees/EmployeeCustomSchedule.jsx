// src/components/employees/EmployeeCustomSchedule.jsx
import { forwardRef } from "react";

const DAY_MAP = {
  MO: "Monday",
  TU: "Tuesday", 
  WE: "Wednesday",
  TH: "Thursday",
  FR: "Friday",
  SA: "Saturday",
  SU: "Sunday"
};

const EmployeeCustomSchedule = forwardRef(({ custom_schedule }, ref) => {
  if (!custom_schedule?.length) {
    return (
      <div className="p-8 italic text-center text-gray-500 border-2 border-gray-200 border-dashed rounded-2xl">
        No custom schedule defined
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-6">
      {custom_schedule.map((scheduleBlock, blockIndex) => (
        <div key={blockIndex} className="p-6 border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-blue-200">
            <h3 className="text-xl font-bold text-blue-900">
              Schedule Block {blockIndex + 1}
            </h3>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-700">
                {scheduleBlock.start} - {scheduleBlock.end}
              </div>
              {scheduleBlock.rrule && (
                <div className="px-2 py-1 mt-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                  {scheduleBlock.rrule}
                </div>
              )}
            </div>
          </div>

          {/* Days */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {scheduleBlock.days.map((dayCode) => (
                <div
                  key={dayCode}
                  className="px-4 py-2 text-sm font-semibold text-blue-800 bg-white border border-blue-200 shadow-sm rounded-xl"
                >
                  {DAY_MAP[dayCode] || dayCode}
                </div>
              ))}
            </div>
          </div>

          {/* Breaks */}
          {scheduleBlock.breaks?.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 mb-4 font-semibold text-blue-900">
                Breaks
              </h4>
              <div className="space-y-3">
                {scheduleBlock.breaks.map((br, brIndex) => (
                  <div
                    key={brIndex}
                    className="flex items-center justify-between p-4 transition-all border border-orange-200 bg-orange-50 rounded-2xl hover:bg-orange-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="font-medium text-gray-900">{br.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-orange-800">
                        {br.start} - {br.end}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

EmployeeCustomSchedule.displayName = "EmployeeCustomSchedule";
export default EmployeeCustomSchedule;
