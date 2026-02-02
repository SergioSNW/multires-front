import { useState, useEffect, useCallback } from "react";
import * as api from "../../services/api.js";
import { AdminProvider } from "../../contexts/AdminContext.jsx";
import Header from "./Header.jsx";
import StickyTabs from "./StickyTabs.jsx";
import SchedulesTab from "../schedules/SchedulesTab.jsx";
import EmployeesTab from "../employees/EmployeesTab.jsx";

export default function Admin({ tenantId }) {
  const [activeTab, setActiveTab] = useState("schedules");
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState(null);
  const [draftTenant, setDraftTenant] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const tenantData = await api.fetchMyTenant(tenantId);
        setTenant(tenantData.data);
        setDraftTenant({ ...tenantData.data });
        setIsDirty(false);
      } catch (error) {
        console.error("Load error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-xl text-gray-500">Loading...</div>
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
      value={{
        tenant,
        setTenant,
        draftTenant,
        setDraftTenant,
        isDirty,
        setIsDirty,
      }}
    >
      <div className="w-full min-h-screen p-0 bg-gray-200">
        <div className="flex flex-col min-h-screen px-2 pt-4 max-w-none sm:px-4 lg:px-6 xl:px-8">
          <Header />
          <StickyTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Render according activeTab */}
          <div className="flex-1 pt-4">{renderContent()}</div>
        </div>
      </div>
    </AdminProvider>
  );
}
