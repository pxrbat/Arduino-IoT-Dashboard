import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import './DashboardCard.css';

export default function DashboardCard({ title, value, unit, isTemp }) {
  const isHigh = isTemp ? value > 32 : value > 75;
  const statusLabel = isHigh ? (isTemp ? 'High Temp' : 'High Humidity') : 'Normal';

  const Icon = isTemp ? Thermometer : Droplets;

  return (
    <div className="dc-card">
      <div className={`dc-icon ${isTemp ? 'is-temp' : 'is-humidity'}`}>
        <Icon size={16} strokeWidth={1.75} />
      </div>

      <div className="dc-body">
        <p className="dc-title">{title}</p>
        <div className="dc-value-row">
          <span className="dc-value">{value !== undefined ? value : '--'}</span>
          <span className="dc-unit">{unit}</span>
        </div>
        <span className={`dc-status ${isHigh ? 'is-alert' : 'is-normal'}`}>{statusLabel}</span>
      </div>
    </div>
  );
}