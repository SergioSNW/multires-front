// src/components/admin/EmployeesTab.jsx
import { useState } from "react";
import { fetchTenantEmployees, updateEmployee } from "../../services/api.js";

const EmployeesTab = ({ tenant, employees, onEmployeesChange, onTenantChange }) => {
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState({});

  const handleToggleCustomWeek = async (employeeId, customWeek) => {
    setSaving(prev => ({ ...prev, [employeeId]: true }));
    
    try {
      const updated = await updateEmployee(employeeId, { 
        custom_week: customWeek,
        tenant_id: tenant.id 
      });
      
      onEmployeesChange(employees.map(emp => 
        emp.id === employeeId ? updated : emp
      ));
      
      // Si desactiva custom_week → usa general_schedule del tenant
      if (!customWeek) {
        // Opcional: refresh tenant para recalcular
        onTenantChange({ ...tenant, general_schedule_updated: Date.now() });
      }
      
    } catch (error) {
      console.error("Update employee error:", error);
      alert(`Failed to update: ${error.message}`);
    } finally {
      setSaving(prev => ({ ...prev, [employeeId]: false }));
    }
  };

  const handleEditSchedule = (employeeId) => {
    setEditingId(editingId === employeeId ? null : employeeId);
  };

  return (
    <div className="employees-tab">
      <div className="employees-header">
        <h2>Employees ({employees.length})</h2>
        <button className="add-employee-btn" disabled={!tenant}>
          + Add Employee
        </button>
      </div>

      <div className="employees-list">
        {employees.map(employee => (
          <div key={employee.id} className="employee-card">
            <div className="employee-info">
              <div className="employee-name">{employee.name}</div>
              <div className="employee-meta">
                {employee.role || 'Barber'} • 
                {employee.phone ? ` ${employee.phone}` : ''}
              </div>
            </div>

            <div className="employee-controls">
              {/* Toggle Custom Week */}
              <label className="custom-week-toggle">
                <input
                  type="checkbox"
                  checked={employee.custom_week || false}
                  onChange={e => handleToggleCustomWeek(
                    employee.id, 
                    e.target.checked
                  )}
                  disabled={saving[employee.id]}
                />
                <span>Custom Schedule</span>
              </label>

              {/* Quick Actions */}
              <div className="quick-actions">
                <button 
                  onClick={() => handleEditSchedule(employee.id)}
                  className={editingId === employee.id ? 'active' : ''}
                  title="Edit Schedule"
                >
                  {editingId === employee.id ? '✏️' : '⏰'}
                </button>
                
                <button title="Services" disabled>✂️</button>
                <button title="Delete" className="danger">🗑️</button>
              </div>
            </div>

            {/* Inline Schedule Editor (si custom_week=true) */}
            {employee.custom_week && editingId === employee.id && (
              <div className="inline-schedule-editor">
                <div className="mini-days-grid">
                  {/* Mini versión de los 7 inputs de SchedulesTab */}
                  Mon: <input type="time" defaultValue="09:00" /> - <input type="time" defaultValue="18:00" />
                  {/* ... resto días */}
                </div>
                <button className="save-mini">Save Schedule</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="empty-state">
          <p>No employees yet</p>
          <button className="add-employee-btn primary">Add First Employee</button>
        </div>
      )}
    </div>
  );
};

export default EmployeesTab;
