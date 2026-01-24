// src/components/admin/Admin.jsx
import { useEffect, useState } from "react";
import SchedulesTab from "./SchedulesTab ";
import { fetchTenant, fetchTenantEmployees } from "../../services/api.js";

const TAB_ICONS = {
  horarios: "⏰",
  employees: "👤",
  services: "✂️",
  events: "🎈",
  settings: "⚙️",
};

const TABS = [
  { id: "horarios", label: "Schedules" },
  { id: "employees", label: "Employees" },
  { id: "services", label: "Services" },
  { id: "events", label: "Events" },
  { id: "settings", label: "Settings" },
];

export default function Admin({ tenantId }) {
  const [activeTab, setActiveTab] = useState("horarios");
  const [tenant, setTenant] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [tenantData, employeesData] = await Promise.all([
          fetchTenant(tenantId),
          fetchTenantEmployees(tenantId),
        ]);
        setTenant(tenantData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Load admin data error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tenantId]);

  if (loading) return <div className="admin-loading">Loading...</div>;

  const TabContent = {
    horarios: (
      <SchedulesTab
        tenant={tenant}
        employees={employees}
        onTenantChange={setTenant}
      />
    ),
    // 👤
    employees: (
      <EmployeesTab
        tenant={tenant}
        employees={employees}
        onEmployeesChange={setEmployees}
        onTenantChange={setTenant}
      />
    ),
    services: <div>Services Tab TODO</div>,
    events: <div>Events Tab TODO</div>,
    settings: <div>Settings Tab TODO</div>,
  };
  return (
    <div className="admin">
      {/* Tenant Subheader */}
      <header className="admin-header">
        <div className="tenant-name">{tenant?.name || "Loading..."}</div>
        <div className="tenant-meta">
          {tenant?.city}, {tenant?.plan}
        </div>
      </header>

      {/* Tabs */}
      <nav className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            aria-label={tab.label}
          >
            {TAB_ICONS[tab.id]}
          </button>
        ))}
      </nav>

      <main className="admin-content">{TabContent[activeTab]}</main>
    </div>
  );
}
