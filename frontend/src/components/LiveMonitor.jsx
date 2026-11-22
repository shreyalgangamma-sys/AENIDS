import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid } from 'recharts';

export default function LiveMonitor() {
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState('Connecting to WebSocket...');
  const [reviewedIds, setReviewedIds] = useState({});

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/alerts');
    ws.onopen = () => setStatus('🟢 LIVE CONNECTION ACTIVE');
    ws.onmessage = (event) => {
      const newAlert = JSON.parse(event.data);
      setAlerts((prev) => [newAlert, ...prev].slice(0, 20)); 
    };
    ws.onclose = () => setStatus('🔴 CONNECTION LOST');
    return () => ws.close();
  }, []);

  const submitFeedback = async (alertId, label) => {
    try {
      await fetch('http://127.0.0.1:8000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId, human_label: label, notes: "Live Feed" })
      });
      setReviewedIds(prev => ({ ...prev, [alertId]: label }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '8px', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>Live Network Stream</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Monitoring raw packet captures.</p>

      <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--accent-cyan)', margin: 0, fontFamily: 'Share Tech Mono' }}>SNIFFER INTERFACE</h2>
        <div style={{ padding: '10px 20px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px', border: `1px solid ${status.includes('🟢') ? 'var(--accent-success)' : 'var(--accent-danger)'}`, color: status.includes('🟢') ? 'var(--accent-success)' : 'var(--accent-danger)', fontFamily: 'Share Tech Mono' }}>
          {status}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          Awaiting packet data...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {alerts.map((alert, idx) => {
            const chartData = alert.shap_explanation?.map(item => ({
              name: item.feature,
              impact: item.impact,
            })) || [];

            return (
              <div key={idx} className="card" style={{ borderLeft: `4px solid ${alert.status === 'UNKNOWN_ATTACK' ? 'var(--accent-danger)' : alert.status === 'NORMAL' ? 'var(--accent-success)' : 'var(--accent-warning)'}` }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '18px', textShadow: '0 0 5px rgba(255,255,255,0.2)' }}>{alert.classification}</strong>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', margin: '4px 0 0 0', fontFamily: 'Share Tech Mono' }}>ID: {alert.alert_id}</p>
                  </div>
                  <span style={{ color: alert.status === 'UNKNOWN_ATTACK' ? 'var(--accent-danger)' : alert.status === 'NORMAL' ? 'var(--accent-success)' : 'var(--accent-warning)', fontWeight: 'bold', fontFamily: 'Share Tech Mono' }}>
                    {alert.status}
                  </span>
                </div>

                {alert.status === 'UNKNOWN_ATTACK' && chartData.length > 0 && (
                  <div style={{ marginTop: '16px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,0,60,0.2)' }}>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '12px', margin: '0 0 10px 0', fontFamily: 'Share Tech Mono', letterSpacing: '1px' }}>THREAT EXPLAINABILITY</p>
                    
                    <p style={{ color: '#e2e8f0', fontSize: '11px', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                      <span style={{ color: 'var(--accent-danger)' }}>Red columns (downward)</span> show the features that triggered this anomaly alert. 
                      <span style={{ color: 'var(--accent-success)' }}> Green columns (upward)</span> indicate normal behaviors.
                    </p>

                    <div style={{ height: '220px', width: '100%', marginTop: '10px' }}>
                      <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 50 }}>
                          <defs>
                            <linearGradient id="glowRed" x1="0" y1="1" x2="0" y2="0">
                              <stop offset="0%" stopColor="#ff003c" stopOpacity={0.9}/>
                              <stop offset="100%" stopColor="#ff003c" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="glowGreen" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00ff88" stopOpacity={0.9}/>
                              <stop offset="100%" stopColor="#00ff88" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          
                          {/* Added subtle grid lines */}
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

                          <XAxis 
                            dataKey="name" 
                            stroke="#475569" 
                            fontSize={10} 
                            fontFamily="Share Tech Mono" 
                            angle={-35} 
                            textAnchor="end" 
                            interval={0} 
                            tickMargin={10}
                          />
                          <YAxis type="number" stroke="#475569" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #ff003c', fontFamily: 'Share Tech Mono', fontSize: 12 }} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                          <ReferenceLine y={0} stroke="#475569" />
                          
                          {/* Thinner bars with glowing drop shadows */}
                          <Bar dataKey="impact" barSize={30} radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, i) => (
                              <Cell 
                                key={`cell-${i}`} 
                                fill={entry.impact < 0 ? 'url(#glowRed)' : 'url(#glowGreen)'} 
                                style={{ filter: entry.impact < 0 ? 'drop-shadow(0px 0px 8px rgba(255,0,60,0.6))' : 'drop-shadow(0px 0px 8px rgba(0,255,136,0.6))' }}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {alert.human_review_required && (
                  <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'rgba(255, 184, 0, 0.1)', borderRadius: '4px', border: '1px solid var(--accent-warning)' }}>
                    {reviewedIds[alert.alert_id] ? (
                      <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--accent-success)', fontFamily: 'Share Tech Mono' }}>✅ CLASSIFIED AS: {reviewedIds[alert.alert_id]}</p>
                    ) : (
                      <>
                        <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--accent-warning)', fontFamily: 'Share Tech Mono' }}>MANUAL CLASSIFICATION REQUIRED:</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {['DoS', 'Probe', 'R2L', 'U2R', 'False Positive'].map((opt) => (
                            <button 
                              key={opt} 
                              onClick={() => submitFeedback(alert.alert_id, opt)}
                              className="cyber-btn btn-yellow" 
                              style={{ padding: '6px 12px', fontSize: '11px' }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}