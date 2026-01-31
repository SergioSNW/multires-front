// src/components/admin/Admin.jsx
import { useState, useEffect, useCallback } from "react";
import * as api from "../../services/api.js";
import { AdminProvider } from "../../contexts/AdminContext.jsx";
import Header from "../schedules/Header.jsx";
import StickyTabs from "../schedules/StickyTabs.jsx";
import SchedulesTab from "../schedules/SchedulesTab.jsx";
import EmployeesTab from "../employees/EmployeesTab.jsx";

export default function Admin({ tenantId }) {
  const [activeTab, setActiveTab] = useState("schedules");
  const [loading, setLoading] = useState(true);

  const [tenant, setTenant] = useState(null);
  const [draftTenant, setDraftTenant] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [draftEmployees, setDraftEmployees] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [tenantData, employeesData] = await Promise.all([
          api.fetchMyTenant(tenantId),
          api.fetchEmployees(tenantId),
        ]);
        // Info at segments .data
        setTenant(tenantData.data);
        setEmployees(employeesData.data);
        // Load drafts
        setDraftTenant({ ...tenantData.data });
        setDraftEmployees({ ...employeesData.data });
        console.log(
          "Loaded to provider ....\n@tenant:",
          tenantData.data,
          "@employees:",
          employeesData.data
        );
      } catch (error) {
        console.error("Load admin data error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tenantId]);

  // const updateTenant = async (data) => {
  //   setTenant(data);
  //   await api.updateTenant(tenantId, data);
  // };
  // const updateEmployees = async (data) => {
  //   setEmployees(data);
  //   await api.updateEmployees(tenantId, data);
  // };

  // This function only is passed to StickyTab
  // const saveDraft = async () => {
  //   try {
  //     const saved = await api.updateTenant(tenantId, draftTenant);
  //     setTenant(saved);
  //     setDraftTenant(saved);
  //     setIsDirty(false);
  //   } catch (error) {
  //     setDraftTenant(tenant); // Rollback
  //   }
  // };

  // const markDirty = () => setIsDirty(true);

  const markDirty = useCallback(() => setIsDirty(true), []);
  const saveDraft = useCallback(async () => {
    if (!isDirty || !draftTenant) return;

    try {
      console.log("💾 Saving McArthur schedule");

      // 🔥 TU API anterior + tenant completo
      const result = await api.updateMyGeneralWeek({
        general_schedule: draftTenant.general_schedule, // Array[5]
        general_breaks: draftTenant.general_breaks, // Array[2]
        general_holidays: [], // Holidays pendiente
        // + otros campos tenant si cambias name/address...
        name: draftTenant.name,
        minutes_slot: draftTenant.minutes_slot,
      });

      console.log("✅ Saved:", result.data);
      setTenant(result.data);
      setDraftTenant(result.data);
      setIsDirty(false);
    } catch (error) {
      console.error("❌ Save error:", error);
      setDraftTenant(tenant); // Rollback
      alert("Error guardando schedule");
    }
  }, [draftTenant, tenant, isDirty]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-xl text-gray-500">Cargando Admin...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "schedules":
        return <SchedulesTab />;
      case "employees":
        return <EmployeesTab />;
      default:
        return <SchedulesTab />;
    }
  };

  return (
    <AdminProvider
      // tenant={tenant}
      // draftTenant={draftTenant}
      // setDraftTenant={setDraftTenant}
      // isDirty={isDirty}
      // employees={employees}
      tenant={tenant}
      draftTenant={draftTenant}
      onDraftChange={setDraftTenant}
      onMarkDirty={markDirty}
    >
      <div className="w-full min-h-screen p-0 bg-gray-200">
        <div className="flex flex-col min-h-screen px-2 pt-4 max-w-none sm:px-4 lg:px-6 xl:px-8">
          <Header />
          <StickyTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSave={saveDraft}
            isDirty={isDirty}
          />

          {/* Render according activeTab */}
          <div className="flex-1 pt-4">{renderContent()}</div>
        </div>
      </div>
    </AdminProvider>
  );
}
