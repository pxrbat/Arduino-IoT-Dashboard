import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Droplets,
  Layers,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Thermometer,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import DashboardCard from './components/DashboardCard';
import EnvironmentalChart from './components/EnvironmentalChart';
import DataTable from './components/DataTable';
import AdminControls from './components/AdminControls';
import LiveFeed from './components/Livefeed';
import LoginPage from './components/LoginPage';
import './App.css';
import socketIOClient from 'socket.io-client';

const API_END_POINT = 'http://localhost:5000/api/sensor/data';
const SOCKET_URL = 'http://localhost:5000';
const SESSION_STORAGE_KEY = 'iot-dashboard-session';

const DEMO_USERS = {
  'admin@iot.local': {
    password: 'admin123',
    name: 'System Admin',
    role: 'admin',
  },
  'user@iot.local': {
    password: 'user123',
    name: 'Guest Operator',
    role: 'user',
  },
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [dataLogs, setDataLogs] = useState([]);
  const [errorSyncing, setErrorSyncing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!savedSession) {
      return;
    }

    try {
      const parsedSession = JSON.parse(savedSession);
      if (parsedSession?.email && parsedSession?.role) {
        setSession(parsedSession);
      }
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const fetchSensorLogs = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (!session) {
      setIsLive(false);
      setDataLogs([]);
      setErrorSyncing(false);
      return undefined;
    }

    const socket = socketIOClient(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsLive(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsLive(false);
    });

    // Backend emits this event after a reading lands on /api/sensor/emit,
    // roughly every 2 seconds while the ESP32 is reporting.
    socket.on('newSensorData', (data) => {
      const reading = Array.isArray(data) ? data[0] : data;
      if (!reading) return;

      const newLog = {
        timestamp: reading.timestamp || new Date().toISOString(),
        temperature: reading.temperature,
        humidity: reading.humidity
      };

      setDataLogs(currentLogs => [newLog, ...currentLogs].slice(0, 40));
      setErrorSyncing(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [session]);

  useEffect(() => {
    if (!session) {
      return undefined;
    }

    fetchSensorLogs();
    const runtimeInterval = setInterval(fetchSensorLogs, 3000);
    return () => clearInterval(runtimeInterval);
  }, [fetchSensorLogs, session]);

  const handleLogin = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = DEMO_USERS[normalizedEmail];

    if (!account || account.password !== password) {
      setLoginError('Invalid credentials. Try admin@iot.local / admin123 or user@iot.local / user123.');
      return false;
    }

    const nextSession = {
      email: normalizedEmail,
      name: account.name,
      role: account.role,
    };

    setSession(nextSession);
    setLoginError('');
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    return true;
  };

  const handleLogout = () => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    setDataLogs([]);
    setLoginError('');
  };

  const newestLog = dataLogs[0] || { temperature: 0, humidity: 0 };

  if (!session) {
    return <LoginPage onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="app-shell">
      <div className="app-shell-glow app-shell-glow-a" />
      <div className="app-shell-glow app-shell-glow-b" />

      <header className="header">
        <div className="header-title-container">
          <Layers size={22} />
          <div>
            <h1 className="dashboard-title">IoT Environmental Monitor Panel</h1>
            <p className="dashboard-subtitle">Signed in as {session.name}</p>
          </div>
        </div>

        <div className="header-actions">
          <span className={`connection-pill ${isLive ? 'is-live' : 'is-offline'}`}>
            {isLive ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isLive ? 'Live socket' : 'Offline cache'}
          </span>
          {errorSyncing && <span className="error-message">Connection lost — showing simulated data</span>}
          <button className="sync-button" onClick={fetchSensorLogs}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        <section className="account-strip">
          <div>
            <p className="account-label">Session</p>
            <h2 className="account-name">{session.name}</h2>
          </div>
          <div className="account-meta">
            {session.role === 'admin' ? <ShieldCheck size={16} /> : <User size={16} />}
            <span>{session.role === 'admin' ? 'Administrator access' : 'User access'}</span>
          </div>
        </section>

        {session.role === 'admin' && <AdminControls onRefresh={fetchSensorLogs} />}

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

        <LiveFeed dataLogs={dataLogs} isLive={isLive} />

        <EnvironmentalChart dataLogs={dataLogs} />
        <DataTable dataLogs={dataLogs} />
      </main>
    </div>
  );
}