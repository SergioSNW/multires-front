// src/components/admin/Admin.jsx → conectada
import { useEffect, useState } from "react";
import { fetchMyTenant, fetchEmployees } from "../../services/api.js";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("horarios");
  const [tenant, setTenant] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // console.log("🔄 Loading tenant:", tenantId);
        const [tenantData, employeesData] = await Promise.all([
          fetchMyTenant(), // /tenants/me
          fetchEmployees(), // /employees (JWT autofill)
        ]);
        setTenant(tenantData.data);
        setEmployees(employeesData.data);
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const tabs = [
    { id: "horarios", icon: "⏰" },
    { id: "employees", icon: "👤" },
    { id: "services", icon: "✂️" },
    { id: "events", icon: "🎈" },
    { id: "settings", icon: "⚙️" },
  ];

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading McArthur...
      </div>
    );
  if (error)
    return <div style={{ padding: "2rem", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
          padding: "1rem 0",
          borderBottom: "3px solid #3b82f6",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", color: "#1f2937" }}>
            {tenant.name}
          </h1>
          <p
            style={{
              margin: "0.5rem 0 0 0",
              color: "#6b7280",
              fontSize: "1.1rem",
            }}
          >
            {tenant.city || "Madrid"}, {tenant.plan || "Basic"} Plan
          </p>
        </div>
      </header>
      {/* Tabs */}
      <nav
        style={{
          display: "flex",
          gap: "0.25rem",
          marginBottom: "2rem",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "1rem 1.5rem",
              border: activeTab === tab.id ? "none" : "1px solid #d1d5db",
              background: activeTab === tab.id ? "#3b82f6" : "white",
              color: activeTab === tab.id ? "white" : "#374151",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "1.5rem",
              boxShadow:
                activeTab === tab.id
                  ? "0 4px 12px rgba(59,130,246,0.4)"
                  : "none",
              transition: "all 0.2s",
            }}
            title={tab.id}
          >
            {tab.icon}
          </button>
        ))}
      </nav>

      {/* Content */}
      {activeTab === "horarios" && (
        <div style={{ display: "flex", gap: "2rem", height: "70vh" }}>
          {/* Inputs izquierda */}
          <div style={{ width: "300px", padding: "1rem" }}>
            <h3>General Schedule</h3>
            {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
              <div
                key={day}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              >
                <label>
                  <input type="checkbox" defaultChecked /> {day.toUpperCase()}
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <input
                    type="time"
                    step="900s"
                    defaultValue="07:00"
                    style={{ flex: 1 }}
                  />
                  <span>-</span>
                  <input type="time" defaultValue="18:00" style={{ flex: 1 }} />
                </div>
              </div>
            ))}
            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              💾 Save Schedule
            </button>
          </div>

          {/* Coverage derecha */}
          <div
            style={{
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                color: "#0369a1",
              }}
            >
              📊 FullCalendar Coverage
              <br />
              {employees.map((e) => (
                <div key={e.id}>{e.name}: Lun-Vie 09-18</div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === "horarios_ANTERIOR" && (
        <div
          style={{
            height: "70vh",
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "2rem",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Schedules Tab</h2>
          <p>FullCalendar coverage + 7 inputs (next step)</p>
          <div
            style={{
              height: "500px",
              background: "#e0f2fe",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: "#0369a1",
            }}
          >
            ⏰ Coverage Preview
            <br />
            {employees.length} employees •{" "}
            {tenant.general_week ? "General schedule active" : "Setup required"}
          </div>
        </div>
      )}
      {activeTab === "employees" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <h2>Employees ({employees.length})</h2>
            <button
              style={{
                background: "#10b981",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              + Add Employee
            </button>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {employees.map((emp) => (
              <div
                key={emp.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.5rem 2rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  background: "white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {emp.name}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                    {emp.role || "Barber"}
                  </div>
                </div>

                <div style={{ textAlign: "right", minWidth: "250px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                      fontSize: "0.95rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={emp.custom_week || false}
                      readOnly
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                    <span style={{ fontWeight: 500 }}>Custom Schedule</span>
                  </label>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        background: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      ⏰ Edit
                    </button>
                    <button
                      style={{
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        background: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      ✂️ Services
                    </button>
                    <button
                      style={{
                        padding: "0.75rem",
                        color: "#ef4444",
                        border: "1px solid #f87171",
                        background: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === "services" && (
        <div style={{ padding: "4rem" }}>✂️ Services WIP</div>
      )}
      {activeTab === "events" && (
        <div style={{ padding: "4rem" }}>🎈 Events WIP</div>
      )}
      {activeTab === "settings" && (
        <div style={{ padding: "4rem" }}>⚙️ Settings WIP</div>
      )}
    </div>
  );
}
