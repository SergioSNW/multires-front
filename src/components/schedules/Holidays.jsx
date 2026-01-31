// src/components/schedules/Holidays.jsx - LÍNEA 2 con Annual+Boton + draftTenant REAL
import { useAdmin } from "../../contexts/AdminContext.jsx";
import { useState } from "react";

export default function Holidays() {
  const { draftTenant, setDraftTenant } = useAdmin();
  const [editingIndex, setEditingIndex] = useState(null);
  const [newHoliday, setNewHoliday] = useState({
    date: "",
    to: "",
    label: "",
    recurring: false
  });

  if (!draftTenant) 
    return <div className="p-12 text-center text-gray-400">Loading...</div>;

  const holidays = draftTenant.general_holidays || [];

  // FORMAT DATE TO DD-MMM
  const formatDateShort = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short' 
    }).replace(' ', '-');
  };

  // VALIDATE TO DATE > FROM DATE
  const isValidPeriod = (from, to) => {
    if (!to) return true;
    return new Date(to) > new Date(from);
  };

  // HANDLERS - DRAFTTENANT REAL ✅
  const updateNewHoliday = (field, value) => {
    setNewHoliday(prev => ({ ...prev, [field]: value }));
  };

  const addHoliday = () => {
    if (!newHoliday.date || !newHoliday.label || !isValidPeriod(newHoliday.date, newHoliday.to)) 
      return;

    const holidayData = {
      date: newHoliday.date,
      label: newHoliday.label,
      rrule: newHoliday.to 
        ? `FREQ=DAILY;UNTIL=${newHoliday.to}T235959Z`
        : `FREQ=DAILY;UNTIL=${newHoliday.date}T235959Z`,
      recurring: newHoliday.recurring
    };

    // 🔥 GUARDADO REAL EN draftTenant
    setDraftTenant(prev => ({
      ...prev,
      general_holidays: [...(prev.general_holidays || []), holidayData]
    }));

    setNewHoliday({ date: "", to: "", label: "", recurring: false });
  };

  const deleteHoliday = (index) => {
    setDraftTenant(prev => ({
      ...prev,
      general_holidays: prev.general_holidays.filter((_, i) => i !== index)
    }));
  };

  const updateDraftHoliday = (index, field, value) => {
    setDraftTenant(prev => ({
      ...prev,
      general_holidays: prev.general_holidays.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const toggleDraftRecurring = (index) => {
    updateDraftHoliday(index, 'recurring', !holidays[index].recurring);
  };

  const startEdit = (index) => setEditingIndex(index);
  const saveEdit = () => setEditingIndex(null);

  const getBadgeText = (holiday) => {
    return holiday.recurring ? "Annual" : new Date(holiday.date).getFullYear().toString();
  };

  return (
    <div className="p-8 border border-indigo-200 shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 lg:p-12 rounded-3xl">
      <div className="flex items-center justify-between pb-6 mb-10 border-b-4 border-purple-200">
        <h4 className="text-2xl font-black tracking-tight text-indigo-900">
          🏖️ General Holidays
        </h4>
      </div>

      {/* NEW HOLIDAY FORM - 2 LÍNEAS SIN SEPARADOR */}
      <div className="p-6 mb-8 border-2 border-purple-200 border-dashed rounded-2xl bg-purple-50/50">
        <div className="grid grid-cols-4 gap-6">
          {/* LÍNEA 1: From | To | Label | empty */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-purple-800">From</label>
            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) => updateNewHoliday('date', e.target.value)}
              className="w-[140px] px-2 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-semibold text-purple-800">To (optional)</label>
            <input
              type="date"
              value={newHoliday.to}
              min={newHoliday.date || undefined}
              onChange={(e) => updateNewHoliday('to', e.target.value)}
              className={`w-[140px] px-2 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-purple-500 ${
                newHoliday.date && newHoliday.to && !isValidPeriod(newHoliday.date, newHoliday.to)
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-purple-300 focus:border-purple-500'
              }`}
            />
          </div>
          
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-semibold text-purple-800">Name</label>
            <input
              type="text"
              value={newHoliday.label}
              onChange={(e) => updateNewHoliday('label', e.target.value)}
              placeholder="Holiday name"
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              maxLength={30}
            />
          </div>
        </div>

        {/* LÍNEA 2: empty | empty | Annual | +Add button */}
        <div className="grid grid-cols-4 gap-6 mt-4">
          <div />
          <div />
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={newHoliday.recurring}
                onChange={(e) => updateNewHoliday('recurring', e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="font-medium text-purple-800">Annual</span>
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={addHoliday}
              disabled={!newHoliday.date || !newHoliday.label || !isValidPeriod(newHoliday.date, newHoliday.to)}
              className="w-[140px] h-[42px] px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add
            </button>
          </div>
        </div>

        {!isValidPeriod(newHoliday.date, newHoliday.to) && newHoliday.to && (
          <p className="mt-3 text-sm text-red-600">End date must be after start date</p>
        )}
      </div>

      {/* HOLIDAYS LIST */}
      <div className="space-y-4">
        {holidays.map((holiday, index) => {
          const isEditing = editingIndex === index;
          const color = holiday.recurring ? "emerald" : "orange";
          const badgeText = getBadgeText(holiday);
          const from = formatDateShort(holiday.date);
          const hasToDate = holiday.rrule?.includes('UNTIL') && 
            holiday.rrule !== `FREQ=DAILY;UNTIL=${holiday.date}T235959Z`;
          const toDate = hasToDate ? new Date(holiday.rrule.match(/UNTIL=(\d{4}-\d{2}-\d{2})/)?.[1]) : null;
          const to = toDate ? formatDateShort(toDate) : null;

          return (
            <div
              key={holiday.date || index}
              className={`group flex items-center justify-between p-6 transition-all border-2 rounded-2xl hover:shadow-xl bg-white/80 ${
                holiday.recurring
                  ? "border-emerald-200 hover:border-emerald-400 shadow-emerald-100 hover:shadow-emerald-200"
                  : "border-orange-200 hover:border-orange-400 shadow-orange-100 hover:shadow-orange-200"
              } ${isEditing ? 'ring-4 ring-purple-200 ring-opacity-50' : ''}`}
            >
              <div className="flex items-center flex-1 gap-4">
                <div
                  className={`w-2 h-8 rounded-full ${
                    holiday.recurring ? "bg-emerald-400" : "bg-orange-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {isEditing ? (
                      <input
                        value={holiday.label}
                        onChange={(e) => updateDraftHoliday(index, 'label', e.target.value)}
                        className="flex-1 px-2 py-1 text-xl font-bold text-gray-900 bg-transparent border-none rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        maxLength={30}
                      />
                    ) : (
                      <div className="text-xl font-bold text-gray-900">
                        {holiday.label}
                      </div>
                    )}
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        holiday.recurring
                          ? "text-emerald-700 bg-emerald-100"
                          : "text-orange-700 bg-orange-100"
                      }`}
                    >
                      {badgeText}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {isEditing ? (
                      <>
                        <input
                          type="date"
                          value={holiday.date}
                          onChange={(e) => updateDraftHoliday(index, 'date', e.target.value)}
                          className="w-[140px] font-mono text-lg font-semibold bg-transparent border-b-2 border-purple-500 focus:outline-none px-1"
                        />
                        {hasToDate && (
                          <>
                            <span className="mx-2 text-2xl font-bold text-purple-500">➜</span>
                            <input
                              type="date"
                              value={toDate?.toISOString().split('T')[0] || ''}
                              onChange={(e) => {/* rrule update */}}
                              className="w-[140px] font-mono text-lg font-semibold bg-transparent border-b-2 border-purple-500 focus:outline-none px-1"
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <span className={`text-lg font-semibold ${holiday.recurring ? "text-emerald-800" : "text-orange-800"}`}>
                          {from}
                        </span>
                        {hasToDate && (
                          <>
                            <span className="text-2xl font-bold text-purple-500">➜</span>
                            <span className={`text-lg font-semibold ${holiday.recurring ? "text-emerald-800" : "text-orange-800"}`}>
                              {to}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 text-sm font-semibold transition-all border rounded-lg text-emerald-600 bg-emerald-100 border-emerald-200 hover:bg-emerald-200"
                  >
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => startEdit(index)}
                    className="p-2 text-indigo-600 transition-all hover:text-indigo-700 hover:bg-indigo-100 rounded-xl"
                    title="Edit"
                  >
                    ✏️
                  </button>
                )}
                <button
                  onClick={() => deleteHoliday(index)}
                  className="p-2 text-red-600 transition-all hover:text-red-700 hover:bg-red-100 rounded-xl"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
