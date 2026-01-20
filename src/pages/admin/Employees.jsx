import { useState, useEffect } from 'react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'barber' });
  const [saving, setSaving] = useState(false);

  // Fetch UNA vez
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/employees', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setEmployees(data.data || []))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
  }, []);  // ← VACÍO = UNA VEZ



  const addEmployee = async (e) => {
    e.preventDefault();
    console.log('➕ POST body:', {
      name: newEmployee.name,
      role: newEmployee.role,
      tenantId: '696956f31e25f13a08a35ec8'
    });
  
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/employees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newEmployee.name,
          role: newEmployee.role,
          tenantId: '696956f31e25f13a08a35ec8'
        })
      });
  
      console.log('📤 POST Status:', res.status);
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'POST failed');
      }
  
      // Optimista: añade sin reload
      const newEmp = { ...newEmployee, _id: Date.now(), tenantId: '696956f31e25f13a08a35ec8' };
      setEmployees(prev => [newEmp, ...prev]);
      setNewEmployee({ name: '', role: 'barber' });
    } catch (err) {
      console.error('❌ POST ERROR:', err);
      alert(err.message);
    }
  };
  
  


  
  if (loading) return <div className="p-8 text-xl">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl p-8 mx-auto">
      <h1 className="mb-8 text-4xl font-bold">Empleados ({employees.length})</h1>
      
      <form onSubmit={addEmployee} className="max-w-md p-8 mb-8 bg-white shadow-xl rounded-2xl">
        <input
          type="text"
          placeholder="Nombre"
          value={newEmployee.name}
          onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
          className="w-full p-4 mb-4 border rounded-xl"
          required
          disabled={saving}
        />
        <select
          value={newEmployee.role}
          onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
          className="w-full p-4 mb-6 border rounded-xl"
          disabled={saving}
        >
          <option value="barber">Barber</option>
          <option value="reception">Recepción</option>
        </select>
        <button 
          type="submit" 
          disabled={saving || !newEmployee.name}
          className="w-full py-4 text-white bg-green-600 rounded-xl disabled:opacity-50"
        >
          {saving ? 'Creando...' : '➕ Nuevo Empleado'}
        </button>
      </form>

      <div className="grid gap-4">
        {employees.map(emp => (
          <div key={emp._id} className="p-6 transition bg-white shadow rounded-xl hover:shadow-lg">
            <h3 className="text-xl font-bold">{emp.name}</h3>
            <p className="text-gray-600">{emp.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
