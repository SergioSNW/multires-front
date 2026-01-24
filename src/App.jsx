// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Admin from "./components/admin/Admin.jsx"; // ← tu Admin.jsx
import Login from "./pages/Login";

function AdminWrapper() {
  const { tenantId } = useParams(); // captura /admin/:tenantId
  return <Admin tenantId={tenantId} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />

          {/* ✅ Admin con tenantId */}
          <Route path="/admin/:tenantId" element={<AdminWrapper />} />
          <Route path="/admin/:tenantId/schedules" element={<AdminWrapper />} />
          <Route path="/admin/:tenantId/employees" element={<AdminWrapper />} />

          {/* Legacy (opcional) */}
          <Route path="/admin/dashboard" element={<div>Dashboard WIP</div>} />

          {/* Catch-all */}
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
