// src/services/api.js
// const API_BASE = "http://localhost:5050/api/v1";
let API_BASE = "http://localhost:5050/api/v1";
// API_BASE = "https://backend-101-hu0a.onrender.com/api/v1";
// API_BASE = "https://back101.juancarlos.dpdns.org/api/v1";

async function apiRequest(endpoint, options = {}) {
  const pp= localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || "dev"}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// NO tenantId excepto login inicial
export const loginTenant = (credentials) =>
  apiRequest("/tenants/login", { method: "POST", body: credentials });

export const fetchMyTenant = () => apiRequest("/tenants/me"); // o /tenants/profile

export const fetchEmployees = () => apiRequest("/employees");

export const updateMyGeneralWeek = (data) =>
  apiRequest("/tenants/me/general-week", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  export const bulkUpdateEmployees = (data) =>
  apiRequest("/employees/bulk", {
    method: "PUT",
    body: JSON.stringify(data),
  });

