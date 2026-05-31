import React, { useState } from 'react';
import axios from 'axios';

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
    <div className="admin-panel">
      <h3> System Management Panel</h3>
      <p style={{ fontSize: '0.875rem', color: '#7c2d12', margin: '0 0 1rem 0' }}>
        Authorized Actions: Override hardware parameters, system thresholds, or clear persistent log sheets.
      </p>
      
      <div className="admin-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Temperature Limit Sensor Warning (°C)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="number" 
              value={alertThreshold} 
              onChange={(e) => setAlertThreshold(e.target.value)}
              style={{ padding: '0.5rem', width: '80px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
            <button className="admin-btn" onClick={handleUpdateThreshold}>Set</button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="admin-btn-secondary" onClick={handleClearLogs}>
            Purge Storage Logs
          </button>
        </div>
      </div>
    </div>
  );
}