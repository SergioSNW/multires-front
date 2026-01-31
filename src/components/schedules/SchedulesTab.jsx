// src/components/schedules/SchedulesTab.jsx
import ScheduleDays from "./ScheduleDays.jsx";
import Holidays from "./Holidays.jsx";

export default function SchedulesTab() {
  return (
    <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
      <ScheduleDays />
      <Holidays />
    </div>
  );
}
