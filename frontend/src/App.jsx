import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      {/* Ambient glow effects (dark mode only) */}
      {darkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-blue-600/6 rounded-full blur-3xl" />
        </div>
      )}

      {/* ── Fixed Navbar ── */}
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg glow-indigo"
                 style={{
                   background: darkMode
                     ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.15))'
                     : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
                   border: '1px solid rgba(99, 102, 241, 0.2)',
                 }}>
              💰
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className={darkMode
                ? 'bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 bg-clip-text text-transparent'
              }>
                FinanceFlow
              </span>
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
              style={{
                background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="text-lg transition-transform duration-300" style={{ transform: darkMode ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                {darkMode ? '☀️' : '🌙'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content — offset by navbar height */}
      <div className="relative z-10 pt-16">
        <Dashboard darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;
