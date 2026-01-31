import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // fetch('/api/v1/tenants', {  // back101
    fetch('/api/v1/employees', {  // back101
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  debugger;
  console.log(`${localStorage.getItem('token')}`);

  return (
    <div className="p-8">
      <h1 className="mb-8 text-4xl font-bold">Dashboard MultiRes</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <p>¡Conectado back101! → Employees/Calendar next</p>
    </div>
  );
}
