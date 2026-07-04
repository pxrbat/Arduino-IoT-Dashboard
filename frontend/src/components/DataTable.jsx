import React from 'react';
import './DataTable.css';

export default function DataTable({ dataLogs }) {
  return (
    <div className="dt-panel">
      <h3 className='dt-heading'>Incoming Sensed Streams (DHT22)</h3>
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
                <td colSpan="4" className="dt-empty">No packets recorded from Arduino Node MCU yet.</td>
              </tr>
            ) : (
              dataLogs.map((log, index) => {
                const isWarning = log.temperature > 32 || log.humidity > 75;
                return (
                  <tr key={log._id || index}>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{log.temperature}°C</td>
                    <td>{log.humidity}%</td>
                    <td>
                      <span className={`dt-status ${isWarning ? 'is-alert' : 'is-normal'}`}>
                        {isWarning ? 'Flagged Warning' : 'Optimal'}
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