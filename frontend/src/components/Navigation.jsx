import React from 'react';

export default function Navigation({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', desc: 'Live Inference' },
    { id: 'encyclopedia', label: 'Threat Intel', icon: '📚', desc: 'Attack Encyclopedia' },
    { id: 'live', label: 'Live Monitor', icon: '📡', desc: 'Real-time Sniffer' },
    { id: 'cases', label: 'Sample Cases', icon: '🕵️‍♂️', desc: 'Incident Sandbox' },
    { id: 'metrics', label: 'Model Metrics', icon: '🧠', desc: 'System Diagnostics' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo-container">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px var(--accent-cyan))' }}>
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
          <circle cx="12" cy="12" r="3" fill="var(--accent-cyan)"></circle>
          <line x1="12" y1="2" x2="12" y2="9"></line>
          <line x1="12" y1="15" x2="12" y2="22"></line>
        </svg>
        <h1 className="sidebar-logo-text">
          <span className="logo-text-1">NIDS</span>
          <span className="logo-text-2">CORE</span>
        </h1>
      </div>
      
      <div className="sidebar-subtitle">Adaptive & Explainable</div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
          >
            <div className="nav-label">
              <span>{item.icon}</span> {item.label}
            </div>
            <div className="nav-desc">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}