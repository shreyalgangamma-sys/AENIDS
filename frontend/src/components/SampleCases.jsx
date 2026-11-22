import React, { useState } from 'react';

const cases = [
  { id: 1, name: "The Neptune Strike", type: "Denial of Service (DoS)", desc: "A massive SYN flood targeting a web server.", payload: { duration: 0, protocol_type: "tcp", service: "http", flag: "REJ", src_bytes: 0, dst_bytes: 0, count: 511, srv_count: 511, serror_rate: 1.0, same_srv_rate: 0.0 }, mode: "known" },
  { id: 2, name: "Shadow Reconnaissance", type: "Probe / Scanning", desc: "An attacker scanning internal ports for vulnerabilities.", payload: { duration: 0, protocol_type: "icmp", service: "eco_i", flag: "SF", src_bytes: 56, dst_bytes: 0, count: 1, srv_count: 1, serror_rate: 0.0, same_srv_rate: 1.0 }, mode: "known" },
  { id: 3, name: "The Midnight Exfiltration", type: "Remote to Local (R2L)", desc: "Stealing large amounts of data using an unauthorized FTP connection.", payload: { duration: 120, protocol_type: "tcp", service: "ftp_data", flag: "SF", src_bytes: 999999, dst_bytes: 50000, count: 2, srv_count: 1, serror_rate: 0.0, same_srv_rate: 1.0 }, mode: "unknown" },
  { id: 4, name: "Zero-Day Beacon", type: "Unknown Anomaly", desc: "A stealthy, unusual UDP packet pattern never seen before.", payload: { duration: 1, protocol_type: "udp", service: "private", flag: "SF", src_bytes: 1200, dst_bytes: 0, count: 10, srv_count: 10, serror_rate: 0.0, same_srv_rate: 0.0 }, mode: "unknown" }
];

export default function SampleCases() {
  const [selectedCase, setSelectedCase] = useState(cases[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runInvestigation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: selectedCase.payload, mode: selectedCase.mode })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '8px', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>Incident Sandbox</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Select a real-world attack scenario to test the NIDS engine.</p>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Case Selection List */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cases.map(c => (
            <div 
              key={c.id} 
              onClick={() => { setSelectedCase(c); setResult(null); }}
              className={`attack-item ${selectedCase.id === c.id ? 'active' : ''}`}
            >
              <div className="attack-name">{c.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginTop: '4px' }}>{c.type}</div>
            </div>
          ))}
        </div>

        {/* Investigation Panel */}
        <div style={{ flex: 2 }}>
          <div className="attack-detail" style={{ height: '100%' }}>
            <h2 style={{ color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono', marginBottom: '16px' }}>{selectedCase.name}</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '24px', lineHeight: 1.6 }}>{selectedCase.desc}</p>
            
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '12px', fontFamily: 'Share Tech Mono' }}>RAW PAYLOAD SNIPPET</h4>
              <pre style={{ color: '#10b981', fontSize: '12px', margin: 0, overflowX: 'auto' }}>
                {JSON.stringify(selectedCase.payload, null, 2)}
              </pre>
            </div>

            <button onClick={runInvestigation} disabled={loading} className="cyber-btn btn-cyan" style={{ width: '100%' }}>
              {loading ? 'Analyzing Threat...' : 'Run Diagnostic Analysis'}
            </button>

            {result && (
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: result.status === 'UNKNOWN_ATTACK' ? 'rgba(255,0,60,0.1)' : 'rgba(0,255,136,0.1)', border: `1px solid ${result.status === 'UNKNOWN_ATTACK' ? 'var(--accent-danger)' : 'var(--accent-success)'}`, borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: result.status === 'UNKNOWN_ATTACK' ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                  RESULT: {result.classification}
                </h3>
                <p style={{ margin: 0, color: '#fff', fontSize: '14px' }}>Status: {result.status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}