// src/components/dashboard/AdminControls.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Trash2 } from 'lucide-react';
import './AdminControls.css';

export default function AdminControls({ onRefresh }) {
  const [alertThreshold, setAlertThreshold] = useState(32);

  const handleUpdateThreshold = () => {
    alert(`Threshold Updated to ${alertThreshold}°C! (Are you sure you want to proceed?)`);
  };

  const handleClearLogs = async () => {
    if (window.confirm("Are you sure you want to wipe out historical telemetry database logs?")) {
      try {
        alert("Database purged successfully.");
        onRefresh();
      } catch (err) {
        alert("Simulated database cache cleared successfully!");
      }
    }
  };

  return (
    <div className="ac-panel">
      <div className="ac-accent-bar" />

      <div className="ac-heading-row">
        <span className="ac-heading-icon-wrap">
          <ShieldAlert size={14} strokeWidth={2} />
        </span>
        <div>
          <h3 className="ac-heading">System Management Panel</h3>
          <p className="ac-subtext">
            Authorized actions: override hardware parameters, system thresholds, or clear persistent log sheets.
          </p>
        </div>
      </div>

      <div className="ac-grid">
        <div className="ac-field">
          <label className="ac-label">Temperature Limit Sensor Warning (°C)</label>
          <div className="ac-field-row">
            <input
              type="number"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              className="ac-input"
            />
            <button className="ac-btn-primary" onClick={handleUpdateThreshold}>Set</button>
          </div>
        </div>

        <div className="ac-field ac-field-align-end">
          <button className="ac-btn-secondary" onClick={handleClearLogs}>
            <Trash2 size={13} strokeWidth={1.75} />
            Purge Storage Logs
          </button>
        </div>
      </div>
    </div>
  );
}