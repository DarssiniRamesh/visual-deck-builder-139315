import React, { useState, useEffect } from 'react';
import './App.css';
import WorkflowDiagram from './components/WorkflowDiagram';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: '100vh', paddingTop: 16 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        {/* Workflow Diagram Slide */}
        <div style={{ width: '100%', marginTop: 16 }}>
          <WorkflowDiagram />
        </div>
      </header>
    </div>
  );
}

export default App;
