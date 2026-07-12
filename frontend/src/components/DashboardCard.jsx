import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import './DashboardCard.css';

export default function DashboardCard({ title, value, unit, isTemp, lowThreshold, highThreshold }) {
  const effectiveHigh = highThreshold ?? (isTemp ? 32 : 75);
  const isTooHigh = value > effectiveHigh;
  const isTooLow = lowThreshold !== undefined && value < lowThreshold;
  const isAlert = isTooHigh || isTooLow;

  let statusLabel = 'Normal';
  if (isTooHigh) statusLabel = isTemp ? 'High Temp' : 'High Humidity';
  else if (isTooLow) statusLabel = 'Low Humidity';

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
        <span className={`dc-status ${isAlert ? 'is-alert' : 'is-normal'}`}>{statusLabel}</span>
      </div>
    </div>
  );
}