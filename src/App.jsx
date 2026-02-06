// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Admin from "./components/admin/Admin.jsx";
import Login from "./pages/Login";

// function AdminWrapper() {
//   const { tenantId } = useParams(); // captura /admin/:tenantId
//   return <Admin tenantId={tenantId} />;
// }

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />

          {/* ✅ Admin simple pues JWT maneja tenantId */}
          <Route path="/admin" element={<Admin />} />

          {/* Catch-all routes not defined */}
          <Route path="*" element={<div>404 - Not Found</div>} />
        </Routes>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </Router>
  );
}

export default App;
