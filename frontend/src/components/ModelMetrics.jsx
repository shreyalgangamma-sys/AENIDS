import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// UPDATED: Real metrics from your Jupyter Notebook
const metricData = [
  { subject: 'Accuracy', A: 77.26, fullMark: 100 },
  { subject: 'Precision', A: 96.76, fullMark: 100 },
  { subject: 'Recall', A: 62.13, fullMark: 100 },
  { subject: 'F1-Score', A: 75.67, fullMark: 100 },
  { subject: 'Specificity', A: 97.25, fullMark: 100 }, // (9444 / (9444+267)) = 97.25%
];

export default function ModelMetrics() {
  return (
    <div>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '8px', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>System Diagnostics</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Live Machine Learning model performance metrics (XGBoost).</p>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Radar Chart Card */}
        <div className="card" style={{ flex: 1, minWidth: '300px', height: '400px' }}>
          <h3 style={{ color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono', marginBottom: '20px' }}>MODEL PERFORMANCE RADAR</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={metricData}>
              <PolarGrid stroke="rgba(0, 243, 255, 0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#00f3ff', fontSize: 12, fontFamily: 'Share Tech Mono' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
              <Radar name="Model" dataKey="A" stroke="#00ff88" fill="#00ff88" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Confusion Matrix Card */}
        <div className="card" style={{ flex: 1, minWidth: '300px' }}>
          <h3 style={{ color: 'var(--accent-cyan)', fontFamily: 'Share Tech Mono', marginBottom: '20px' }}>CONFUSION MATRIX (NSL-KDD)</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
            {/* True Positive */}
            <div style={{ backgroundColor: 'rgba(0,255,136,0.1)', padding: '20px', borderRadius: '8px', border: '1px solid #00ff88', textAlign: 'center' }}>
              <h4 style={{ color: '#00ff88', margin: 0 }}>True Positive</h4>
              <p style={{ fontSize: '24px', color: '#fff', margin: '10px 0 0 0', fontWeight: 'bold' }}>7,973</p>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Attacks correctly caught</span>
            </div>

            {/* False Positive */}
            <div style={{ backgroundColor: 'rgba(255,184,0,0.1)', padding: '20px', borderRadius: '8px', border: '1px solid #ffb800', textAlign: 'center' }}>
              <h4 style={{ color: '#ffb800', margin: 0 }}>False Positive</h4>
              <p style={{ fontSize: '24px', color: '#fff', margin: '10px 0 0 0', fontWeight: 'bold' }}>267</p>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Normal flagged as attack</span>
            </div>

            {/* False Negative */}
            <div style={{ backgroundColor: 'rgba(255,0,60,0.1)', padding: '20px', borderRadius: '8px', border: '1px solid #ff003c', textAlign: 'center' }}>
              <h4 style={{ color: '#ff003c', margin: 0 }}>False Negative</h4>
              <p style={{ fontSize: '24px', color: '#fff', margin: '10px 0 0 0', fontWeight: 'bold' }}>4,860</p>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Attacks missed by model</span>
            </div>

            {/* True Negative */}
            <div style={{ backgroundColor: 'rgba(0,243,255,0.1)', padding: '20px', borderRadius: '8px', border: '1px solid #00f3ff', textAlign: 'center' }}>
              <h4 style={{ color: '#00f3ff', margin: 0 }}>True Negative</h4>
              <p style={{ fontSize: '24px', color: '#fff', margin: '10px 0 0 0', fontWeight: 'bold' }}>9,444</p>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Normal traffic correctly passed</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}