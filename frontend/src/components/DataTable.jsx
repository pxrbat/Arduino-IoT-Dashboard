// src/components/DataTable.jsx
import React from 'react';
import { Table2 } from 'lucide-react';
import './DataTable.css';

export default function DataTable({ dataLogs, tempThreshold = 32, humidityLow, humidityHigh = 75 }) {
  return (
    <div className="dt-panel">
      <div className="dt-header">
        <h3 className="dt-heading">
          <Table2 size={13} strokeWidth={2} />
          Sensor Readings
        </h3>
        <span className="dt-count">{dataLogs.length} records</span>
      </div>

      <div className="dt-table-container">
        <table className="dt-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Temperature</th>
              <th>Humidity</th>
              <th>System Status</th>
            </tr>
          </thead>
          <tbody>
            {dataLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="dt-empty">No readings recorded yet.</td>
              </tr>
            ) : (
              dataLogs.map((log, index) => {
                const isWarning =
  log.temperature > tempThreshold ||
  log.humidity > humidityHigh ||
  (humidityLow !== undefined && log.humidity < humidityLow);
                return (
                  <tr key={log._id || index}>
                    <td className="dt-cell-time">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="dt-cell-num">{log.temperature}°C</td>
                    <td className="dt-cell-num">{log.humidity}%</td>
                    <td>
                      <span className={`dt-status ${isWarning ? 'is-alert' : 'is-normal'}`}>
                        <span className="dt-status-dot" />
                        {isWarning ? 'Flagged' : 'Optimal'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}