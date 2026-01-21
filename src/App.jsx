import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // Crea después
import Dashboard from "./pages/Dashboard"; // Crea después
import Employees from "./pages/admin/Employees";
import Schedules from "./pages/admin/Schedules";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Admin después */}
          <Route path="/admin/*" element={<div>Admin WIP</div>} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/schedules" element={<Schedules />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
