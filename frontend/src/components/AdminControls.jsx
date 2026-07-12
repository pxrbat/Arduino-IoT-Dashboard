// src/components/dashboard/AdminControls.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Trash2 } from 'lucide-react';
import './AdminControls.css';

export default function AdminControls({ session, onRefresh, onThresholdUpdate }) {
  const [tempThreshold, setTempThreshold] = useState(32);
  const [humidityLow, setHumidityLow] = useState(40);
  const [humidityHigh, setHumidityHigh] = useState(75);

  const authHeaders = {
    headers: { Authorization: `Bearer ${session.token}` },
  };

  useEffect(() => {
    const loadThresholds = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/sensor/threshold",
          authHeaders
        );
        setTempThreshold(response.data.tempThreshold);
        setHumidityLow(response.data.humidityThreshold);
        setHumidityHigh(response.data.humidityThresholdHigh);
      } catch (err) {
        console.error("Failed to load thresholds:", err);
      }
    };

    loadThresholds();
  }, []);

  const handleUpdateThresholds = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/sensor/threshold",
        {
          tempThreshold: Number(tempThreshold),
          humidityThreshold: Number(humidityLow),
          humidityThresholdHigh: Number(humidityHigh),
        },
        authHeaders
      );

      setTempThreshold(response.data.tempThreshold);
      setHumidityLow(response.data.humidityThreshold);
      setHumidityHigh(response.data.humidityThresholdHigh);
      alert("Thresholds updated successfully!");
      onThresholdUpdate?.();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update thresholds.");
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to wipe out historical telemetry database logs?")) {
      return;
    }

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
              value={tempThreshold}
              onChange={(e) => setTempThreshold(e.target.value)}
              className="ac-input"
            />
          </div>
        </div>

        <div className="ac-field">
          <label className="ac-label">Low Humidity Warning (%)</label>
          <div className="ac-field-row">
            <input
              type="number"
              value={humidityLow}
              onChange={(e) => setHumidityLow(e.target.value)}
              className="ac-input"
            />
          </div>
        </div>

        <div className="ac-field">
          <label className="ac-label">High Humidity Warning (%)</label>
          <div className="ac-field-row">
            <input
              type="number"
              value={humidityHigh}
              onChange={(e) => setHumidityHigh(e.target.value)}
              className="ac-input"
            />
          </div>
        </div>

        <div className="ac-field ac-field-align-end">
          <button className="ac-btn-primary" onClick={handleUpdateThresholds}>Set Thresholds</button>
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