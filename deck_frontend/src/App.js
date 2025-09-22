import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import WorkflowDiagram from './components/WorkflowDiagram';
import UseCaseFlow from './pages/UseCaseFlow';

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
    <Router>
      <div className="App">
        <header className="App-header" style={{ minHeight: '100vh', paddingTop: 16, justifyContent: 'flex-start' }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* Simple navigation */}
          <nav className="nav-links" aria-label="Primary">
            <Link to="/" className="nav-button" aria-label="Go to Overview">Overview</Link>
            <Link to="/use-cases" className="nav-button primary" aria-label="View Use Case Flows">Use Case Flows</Link>
          </nav>

          <div style={{ width: '100%', marginTop: 16 }}>
            <Routes>
              <Route
                path="/"
                element={<WorkflowDiagram />}
              />
              <Route
                path="/use-cases"
                element={<UseCaseFlow />}
              />
            </Routes>
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;
