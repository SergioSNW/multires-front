// 4. Frontend: schedules/Header.jsx (MODIFICAR)
// Línea actual (grid 5 cols tenant info):

// js
// Col5 timezone ⏱️ (reemplaza "15min")
<div className="col-span-1 text-right">
  <label>Timezone:</label>
  <select 
    value={tenant.timezone || 'Europe/Madrid'}
    onChange={(e) => updateTenant({timezone: e.target.value})}
    className="ml-1"
  >
    {Intl.supportedValuesOf('timeZone').map(tz => (
      <option key={tz} value={tz}>
        {tz} {getTzDisplay(tz)}
      </option>
    ))}
  </select>
</div>



// 5. Frontend: SchedulesTab.jsx (MODIFICAR inputs/coverage)
// Inputs tiempo:

// js
// Antes: value={schedule.start?.slice(11,16)}  ❌ Raw UTC
// Ahora:
value={formatLocal(schedule.start, tenantTz)}  ✅ Local "09:00"

onChange={(e) => {
  const utcStart = localToUtc(e.target.value + ':00', tenantTz);
  updateSchedule({start: utcStart});
}}



// Coverage grid:

// js
// Bloque tiempo
<div>{formatLocal(block.start, employeeTz || tenantTz)}-{formatLocal(block.end, employeeTz || tenantTz)}</div>