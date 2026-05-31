import React from 'react';

export default function DashboardCard({ title, value, unit, icon: Icon, isTemp }) {
  const isHigh = isTemp ? value > 32 : value > 75;
  const statusLabel = isHigh ? (isTemp ? 'High Temp' : 'High Humidity') : 'Normal';

  return (
    <div className="card" style={{ background: '#fafbfc', border: '1px solid #e5e7eb' }}>
      <div>
        <p className="card-title" style={{ color: '#222' }}>{title}</p>
        <div className="card-value-group">
          <span className="card-value" style={{ color: '#222' }}>{value !== undefined ? value : '--'}</span>
          <span className="card-unit" style={{ color: '#888' }}>{unit}</span>
        </div>
        <span
          className={`status-badge ${isHigh ? 'status-alert' : 'status-normal'}`}
          style={{
            background: isHigh ? '#f3f4f6' : '#f9fafb',
            color: isHigh ? '#b91c1c' : '#444',
            border: '1px solid #e5e7eb'
          }}
        >
          {statusLabel}
        </span>
      </div>
      <div className={`icon-wrapper ${isTemp ? 'temp-icon' : 'humidity-icon'}`}> 
        <Icon size={28} color="#888" />
      </div>
    </div>
  );
}