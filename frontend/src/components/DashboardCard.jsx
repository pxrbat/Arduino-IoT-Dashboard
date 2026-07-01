import React from 'react';

export default function DashboardCard({ title, value, unit, isTemp }) {
  const isHigh = isTemp ? value > 32 : value > 75;
  const statusLabel = isHigh ? (isTemp ? 'High Temp' : 'High Humidity') : 'Normal';

  return (
    <div className="card">
      <div>
        <p className="card-title">{title}</p>
        <div className="card-value-group">
          <span className="card-value">{value !== undefined ? value : '--'}</span>
          <span className="card-unit">{unit}</span>
        </div>
        <span className={`status-badge ${isHigh ? 'status-alert' : 'status-normal'}`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}