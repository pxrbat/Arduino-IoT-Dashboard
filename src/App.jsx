import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Thermometer, Droplets, RefreshCw, Layers, ShieldCheck, User } from 'lucide-react';
import DashboardCard from './components/DashboardCard';
import EnvironmentalChart from './components/EnvironmentalChart';
import DataTable from './components/DataTable';
import AdminControls from './components/AdminControls'; // Import Admin Block
import './App.css';

const API_END_POINT = 'http://localhost:5000/api/logs';

export default function App() {
  const [dataLogs, setDataLogs] = useState([]);
  const [errorSyncing, setErrorSyncing] = useState(false);
  
  // Role State: 'user' or 'admin'
  const [currentRole, setCurrentRole] = useState('user');

  const fetchSensorLogs = async () => {
    try {
      const response = await axios.get(API_END_POINT);
      setDataLogs(response.data);
      setErrorSyncing(false);
    } catch (err) {
      setErrorSyncing(true);
      setDataLogs(currentLogs => {
        const mockupReading = {
          timestamp: new Date().toISOString(),
          temperature: parseFloat((23 + Math.random() * 5).toFixed(1)),
          humidity: parseFloat((60 + Math.random() * 12).toFixed(1))
        };
        return [mockupReading, ...currentLogs].slice(0, 40);
      });
    }
  };

  useEffect(() => {
    fetchSensorLogs();
    const runtimeInterval = setInterval(fetchSensorLogs, 3000);
    return () => clearInterval(runtimeInterval);
  }, []);

  const newestLog = dataLogs[0] || { temperature: 0, humidity: 0 };

  return (
    <div>
      {/* Top Selector Banner mimicking Login Switch */}
      <div className="role-banner">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {currentRole === 'admin' ? <ShieldCheck size={16} color="#ea580c" /> : <User size={16} color="#64748b" />}
          View Access Mode: <strong>{currentRole.toUpperCase()}</strong>
        </span>
        <div>
          <label style={{ marginRight: '0.5rem' }}>Switch Account: </label>
          <select 
            className="role-select" 
            value={currentRole} 
            onChange={(e) => setCurrentRole(e.target.value)}
          >
            <option value="user">General Guest / User</option>
            <option value="admin">System Administrator</option>
          </select>
        </div>
      </div>

      <header className="header">
        <div className="header-title-container">
          <Layers size={22} color="#34d399" />
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>IoT Environmental Monitor Panel</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {errorSyncing && <span className="error-message"></span>}
          <button className="sync-button" onClick={fetchSensorLogs}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        
        {/* CONDITIONAL RENDERING: Render administrative configuration options ONLY if role matches 'admin' */}
        {currentRole === 'admin' && (
          <AdminControls onRefresh={fetchSensorLogs} />
        )}

        <div className="cards-grid">
          <DashboardCard 
            title="Temperature Level" 
            value={newestLog.temperature} 
            unit="°C" 
            icon={Thermometer} 
            isTemp={true} 
          />
          <DashboardCard 
            title="Relative Humidity" 
            value={newestLog.humidity} 
            unit="%" 
            icon={Droplets} 
            isTemp={false} 
          />
        </div>

        <EnvironmentalChart dataLogs={dataLogs} />
        <DataTable dataLogs={dataLogs} />
      </main>
    </div>
  );
}