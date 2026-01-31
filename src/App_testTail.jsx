import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-slate-900">
      <div className="px-8 py-6 shadow-xl bg-slate-800/80 rounded-2xl">
        <h1 className="mb-2 text-3xl font-bold">React + Tailwind</h1>
        <p className="text-slate-300">
          b..a..Si ves este fondo oscuro y la tarjeta, Tailwind está funcionando.
        </p>
      </div>
    </div>
  );
}

export default App;
