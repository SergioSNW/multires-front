import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const res = await fetch('/api/login', {  // → back101:5050
      const res = await fetch('/api/v1/tenants/login', {  // → back101:5050
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      debugger;  // ← PAUSA aquí
      const data = await res.json();
      localStorage.setItem('token', data.token);
      navigate('/admin');
      // navigate('/admin/dashboard');
    } catch (err) {
      alert('Error login');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-12 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl">
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">MultiRes</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-4 mb-6 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-4 mb-8 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
