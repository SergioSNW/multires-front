// src/services/api.js
const API_BASE = 'http://localhost:5050/api/v1';

async function apiRequest(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || 'dev'}`,
      ...options.headers
    },
    ...options
  });
  
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const fetchTenant = (id) => apiRequest(`/tenants/${id}`);
export const fetchEmployees = () => apiRequest('/employees');





// // src/services/api.js
// const API_BASE = "/api";

// async function apiRequest(url, options = {}) {
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//     ...options,
//   };

//   const res = await fetch(`${API_BASE}${url}`, config);

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({}));
//     throw new Error(error.error || `HTTP ${res.status}`);
//   }

//   return res.json();
// }

// export async function fetchTenant(tenantId) {
//   return apiRequest(`/tenants/${tenantId}`);
// }

// export async function fetchTenantEmployees(tenantId) {
//   return apiRequest(`/tenants/${tenantId}/employees`);
// }

// export async function updateTenantGeneralWeek(tenantId, data) {
//   return apiRequest(`/tenants/${tenantId}/general-week`, {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });
// }

// export async function updateEmployee(employeeId, data) {
//   return apiRequest(`/employees/${employeeId}`, {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });
// }
