import React, { useState } from 'react';
import Navigation from './components/Navigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import AttackEncyclopedia from './components/AttackEncyclopedia.jsx';
import LiveMonitor from './components/LiveMonitor.jsx';
import SampleCases from './components/SampleCases.jsx';
import ModelMetrics from './components/ModelMetrics.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      
      {/* We use <Navigation /> here, not <Sidebar /> */}
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div style={{ marginLeft: '280px', padding: '40px', width: '100%', maxWidth: '1400px' }}>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'encyclopedia' && <AttackEncyclopedia />}
        {currentPage === 'live' && <LiveMonitor />}
        {currentPage === 'cases' && <SampleCases />}
        {currentPage === 'metrics' && <ModelMetrics />}
      </div>
      
    </div>
  );
}

export default App;