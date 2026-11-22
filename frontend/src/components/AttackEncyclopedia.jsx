import React, { useState } from 'react';

const attackData = [
  { 
    name: "Neptune (DoS)", 
    category: "Denial of Service", 
    icon: "💥",
    severity: "HIGH",
    description: "A SYN flood attack that overwhelms a server with connection requests, preventing legitimate users from accessing it.", 
    indicators: ["High count of connections to the same host", "Very low duration", "High SYN error rate (serror_rate)"] 
  },
  { 
    name: "Nmap (Probe)", 
    category: "Surveillance / Scanning", 
    icon: "🔍",
    severity: "MEDIUM",
    description: "A port scanning tool used by attackers to discover open ports and services on a target machine before launching an attack.", 
    indicators: ["Connections to many different ports", "Very small byte transfers", "High number of rejected connections (flag_REJ)"] 
  },
  { 
    name: "Smurf (DoS)", 
    category: "Denial of Service", 
    icon: "📡",
    severity: "HIGH",
    description: "An amplification attack where the attacker spoofs the target's IP and sends ICMP packets to a broadcast address.", 
    indicators: ["High ICMP traffic", "Same source port rate is very high", "Large payload sizes"] 
  },
  { 
    name: "Guess_Passwd (R2L)", 
    category: "Remote to Local", 
    icon: "🔑",
    severity: "CRITICAL",
    description: "An attacker attempts to gain access to a machine by repeatedly guessing user passwords.", 
    indicators: ["High number of failed logins", "Longer durations", "Multiple connections to the same service like FTP"] 
  },
  { 
    name: "Buffer_Overflow (U2R)", 
    category: "User to Root", 
    icon: "💀",
    severity: "CRITICAL",
    description: "An attacker exploits a software vulnerability to write more data into a buffer than it can hold, potentially gaining root access.", 
    indicators: ["High root shell attempts", "Abnormal byte sizes", "Specific protocol anomalies"] 
  }
];

export default function AttackEncyclopedia() {
  const [selectedAttack, setSelectedAttack] = useState(attackData[0]);

  const getSeverityColor = (severity) => {
    if (severity === 'CRITICAL') return 'var(--accent-danger)';
    if (severity === 'HIGH') return 'var(--accent-warning)';
    return 'var(--accent-success)';
  };

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '8px', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>Threat Intelligence Database</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Access detailed profiles of known network attacks.</p>

      <div className="encyclopedia-container">
        
        {/* Left Side: Attack List */}
        <div className="attack-list">
          {attackData.map((attack, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedAttack(attack)} 
              className={`attack-item ${selectedAttack.name === attack.name ? 'active' : ''}`}
            >
              <div className="attack-item-header">
                <span className="attack-name">{attack.icon} {attack.name}</span>
                <span className="attack-category" style={{ color: getSeverityColor(attack.severity), border: `1px solid ${getSeverityColor(attack.severity)}` }}>
                  {attack.severity}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                {attack.category}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Detail Panel */}
        <div className="attack-detail">
          <div className="detail-header">
            <span style={{ fontSize: '40px', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}>{selectedAttack.icon}</span>
            <div>
              <h2 className="detail-title">{selectedAttack.name}</h2>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'Share Tech Mono', fontSize: '13px' }}>
                CLASSIFICATION: {selectedAttack.category}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono', fontSize: '14px', letterSpacing: '1px', marginBottom: '12px' }}>
              📝 THREAT OVERVIEW
            </h3>
            <div className="detail-description">
              {selectedAttack.description}
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono', fontSize: '14px', letterSpacing: '1px', marginBottom: '12px' }}>
              🔍 DETECTION INDICATORS (SHAP FEATURES)
            </h3>
            <ul className="indicator-list">
              {selectedAttack.indicators.map((indicator, i) => (
                <li key={i} className="indicator-item">
                  <span className="indicator-icon">▶</span> {indicator}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}