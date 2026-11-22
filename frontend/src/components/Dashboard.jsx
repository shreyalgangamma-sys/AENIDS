import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, CartesianGrid } from 'recharts';
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'rgba(0, 0, 0, 0.9)', border: '1px solid #00f3ff', padding: '10px', borderRadius: '4px', boxShadow: '0 0 10px #00f3ff' }}>
        <p style={{ color: '#00f3ff', margin: 0, fontFamily: 'Share Tech Mono' }}>{payload[0].payload.name}</p>
        <p style={{ color: '#fff', margin: '5px 0 0 0' }}>Impact: {payload[0].value.toFixed(4)}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('bar');

  const testFlow = async (type) => {
    setLoading(true);
    setAlert(null);
    let payload, mode = "auto";
    
    if (type === 'normal') {
      mode = "normal";
      payload = { duration: 0, protocol_type: "tcp", service: "http", flag: "SF", src_bytes: 232, dst_bytes: 8153, count: 2, srv_count: 1, serror_rate: 0.0, same_srv_rate: 1.0 };
    }  else if (type === 'known') {
      mode = "known";
      // Make these numbers VERY different from each other
      const knownAttacks = [
        // Profile 1: Massive DoS (Neptune)
        { duration: 0, protocol_type: "tcp", service: "http", flag: "REJ", src_bytes: 0, dst_bytes: 0, count: 511, srv_count: 511, serror_rate: 1.0, same_srv_rate: 0.0 },
        // Profile 2: Scanning (Nmap)
        { duration: 0, protocol_type: "icmp", service: "eco_i", flag: "SF", src_bytes: 56, dst_bytes: 0, count: 1, srv_count: 1, serror_rate: 0.0, same_srv_rate: 1.0 },
        // Profile 3: Probe / Brute Force
        { duration: 10, protocol_type: "tcp", service: "ftp", flag: "SF", src_bytes: 5000, dst_bytes: 100, count: 50, srv_count: 2, serror_rate: 0.1, same_srv_rate: 0.2 }
      ];
      payload = knownAttacks[Math.floor(Math.random() * knownAttacks.length)];
    } else {
      mode = "unknown";
      const zeroDay = [
        { duration: 0, protocol_type: "udp", service: "private", flag: "REJ", src_bytes: 9999999, dst_bytes: 0, count: 1000, srv_count: 1000, serror_rate: 1.0, same_srv_rate: 0.0 },
        { duration: 1, protocol_type: "tcp", service: "http", flag: "REJ", src_bytes: 0, dst_bytes: 0, count: 500, srv_count: 500, serror_rate: 0.0, same_srv_rate: 0.0 }
      ];
      payload = zeroDay[Math.floor(Math.random() * zeroDay.length)];
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: payload, mode: mode })
      });
      const data = await response.json();
      setAlert(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

    const chartData = alert?.shap_explanation?.map(item => ({
    name: item.feature,
    impact: Math.abs(item.impact),
    rawImpact: item.impact,
  
  })) || [];

  const pieData = chartData.map(d => ({ name: d.name, value: d.impact }));

  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '8px', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>Threat Analysis Core</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Initialize packet simulation sequences.</p>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => testFlow('normal')} disabled={loading} className="cyber-btn btn-green">Simulate Normal</button>
        <button onClick={() => testFlow('known')} disabled={loading} className="cyber-btn btn-yellow">Simulate Known</button>
        <button onClick={() => testFlow('unknown')} disabled={loading} className="cyber-btn btn-red">Simulate Zero-Day</button>
      </div>

      {loading && <p style={{ color: 'var(--accent-cyan)', animation: 'pulse 1s infinite' }}>Decrypting traffic...</p>}

      {alert && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ borderLeft: `4px solid ${alert.status === 'UNKNOWN_ATTACK' ? 'var(--accent-danger)' : alert.status === 'NORMAL' ? 'var(--accent-success)' : 'var(--accent-warning)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, color: '#fff', textShadow: '0 0 8px rgba(255,255,255,0.2)' }}>{alert.classification}</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'Share Tech Mono' }}>ID: {alert.alert_id}</p>
              </div>
              <span style={{ padding: '8px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', fontFamily: 'Share Tech Mono', backgroundColor: alert.status === 'UNKNOWN_ATTACK' ? 'rgba(255,0,60,0.1)' : alert.status === 'NORMAL' ? 'rgba(0,255,136,0.1)' : 'rgba(255,184,0,0.1)', color: alert.status === 'UNKNOWN_ATTACK' ? 'var(--accent-danger)' : alert.status === 'NORMAL' ? 'var(--accent-success)' : 'var(--accent-warning)', border: `1px solid ${alert.status === 'UNKNOWN_ATTACK' ? 'var(--accent-danger)' : alert.status === 'NORMAL' ? 'var(--accent-success)' : 'var(--accent-warning)'}` }}>
                {alert.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {chartData.length > 0 && (
            <div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <button onClick={() => setChartType('bar')} className="cyber-btn btn-cyan" style={{ opacity: chartType === 'bar' ? 1 : 0.5 }}>Bar Matrix</button>
                <button onClick={() => setChartType('radar')} className="cyber-btn btn-cyan" style={{ opacity: chartType === 'radar' ? 1 : 0.5 }}>Radar Scan</button>
                <button onClick={() => setChartType('pie')} className="cyber-btn btn-cyan" style={{ opacity: chartType === 'pie' ? 1 : 0.5 }}>Pie Vector</button>
              </div>

              <div className="card" style={{ paddingBottom: '40px' }}>
                <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '10px', fontFamily: 'Share Tech Mono', letterSpacing: '1px' }}>SHAP EXPLAINABILITY MATRIX</h3>
                
                {/* GRAPH EXPLANATION */}
                <div style={{ backgroundColor: 'rgba(0, 243, 255, 0.05)', border: '1px solid rgba(0, 243, 255, 0.2)', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>
                  <p style={{ color: '#e2e8f0', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                    <strong style={{ color: 'var(--accent-cyan)' }}>💡 How to read this:</strong> The graph shows the network features that most influenced the AI's decision. 
                    <span style={{ color: 'var(--accent-danger)', marginLeft: '5px' }}>Red bars pushing down</span> indicate features that made the traffic look <strong>highly anomalous or malicious</strong>. 
                    <span style={{ color: 'var(--accent-success)', marginLeft: '5px' }}>Green bars pushing up</span> indicate features that made it look normal.
                  </p>
                </div>

                <div style={{ height: '350px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      // VERTICAL BAR CHART (Columns)
                                          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                      {/* Neon Gradients */}
                      <defs>
                        <linearGradient id="colorRed" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="#ff003c" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#ff003c" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00ff88" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#00ff88" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      
                      {/* Background Grid for the sci-fi look */}
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

                      <XAxis 
                        dataKey="name" 
                        stroke="#475569" 
                        tick={{fill: '#00f3ff', fontFamily: 'Share Tech Mono', fontSize: 10}} 
                        angle={-35} 
                        textAnchor="end" 
                        interval={0} 
                        tickMargin={10}
                      />
                      <YAxis 
                        type="number" 
                        stroke="#475569" 
                        tick={{fill: '#94a3b8', fontFamily: 'Share Tech Mono', fontSize: 11}} 
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                      <ReferenceLine y={0} stroke="#00f3ff" strokeDasharray="3 3" />
                      
                      {/* barSize makes them thinner, radius rounds the tops */}
                      <Bar dataKey="rawImpact" barSize={40} radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={index} 
                            fill={entry.rawImpact < 0 ? 'url(#colorRed)' : 'url(#colorGreen)'} 
                            style={{ filter: entry.rawImpact < 0 ? 'drop-shadow(0px 0px 8px rgba(255,0,60,0.6))' : 'drop-shadow(0px 0px 8px rgba(0,255,136,0.6))' }} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                    ) : chartType === 'radar' ? (
                      <RadarChart outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="rgba(0, 243, 255, 0.2)" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#00f3ff', fontSize: 11, fontFamily: 'Share Tech Mono' }} />
                        <Radar name="Impact" dataKey="impact" stroke="#00f3ff" fill="#00f3ff" fillOpacity={0.3} dot={{ fill: '#fff' }} />
                        <Tooltip content={<CustomTooltip />} />
                      </RadarChart>
                    ) : (
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={100} stroke="none" label={{ fill: '#00f3ff', fontFamily: 'Share Tech Mono', fontSize: 10 }}>
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={index % 2 === 0 ? '#00f3ff' : '#bd00ff'} style={{ filter: 'drop-shadow(0 0 5px rgba(0,243,255,0.5))' }} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}