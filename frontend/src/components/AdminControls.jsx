// src/components/dashboard/AdminControls.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Trash2 } from 'lucide-react';
import './AdminControls.css';

export default function AdminControls({session, onRefresh }) {
  const [alertThreshold, setAlertThreshold] = useState(32);

  const authHeaders = {
    headers: { Authorization: `Bearer ${session.token}` },
  };

  // used to be after the return statement so it was a dead code block, moved it up here so it actually runs and fetches the threshold from the backend

  useEffect(() => {
    const loadThreshold = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/sensor/threshold"
            );

            setAlertThreshold(response.data.tempThreshold);
        } catch (err) {
            console.error("Failed to load threshold:", err);
        }
    };

    loadThreshold();
  }, []);

  const handleUpdateThreshold = async () => {
    try {
        const response = await axios.put(
            "http://localhost:5000/api/sensor/threshold",
            {
                tempThreshold: Number(alertThreshold),
            },
            authHeaders
        );

        setAlertThreshold(response.data.tempThreshold);

        alert("Threshold updated successfully!");
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to update threshold.");
    }
};

  const handleClearLogs = async () => {
    if (window.confirm("Are you sure you want to wipe out historical telemetry database logs?")) {
      try {
        const response = await axios.delete(
        "http://localhost:5000/api/sensor/data",
        authHeaders
      );
        alert(`Database purged successfully. ${response.data.deletedCount} records removed.`);
        onRefresh();
      } catch (err) {
        console.error(err);
      alert(err.response?.data?.message || "Failed to purge logs.");
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