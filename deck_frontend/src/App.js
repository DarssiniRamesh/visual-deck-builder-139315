import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
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
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {/* Keep logo and Learn React link for existing test compatibility */}
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Current theme: <strong>{theme}</strong>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* Workflow Diagram Slide */}
        <div style={{ width: '100%', marginTop: 32 }}>
          <WorkflowDiagram />
        </div>
      </header>
    </div>
  );
}

export default App;
