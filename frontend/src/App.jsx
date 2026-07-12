// src/App.jsx
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardCard from './components/DashboardCard';
import EnvironmentalChart from './components/EnvironmentalChart';
import DataTable from './components/DataTable';
import AdminControls from './components/AdminControls';
import LiveFeed from './components/Livefeed';
import LoginPage from './components/LoginPage';
import ManageUsers from './components/ManageUsers';
import WelcomeBanner from './components/WelcomeBanner';
import WarningBanner from './components/WarningBanner';
import './components/WarningBanner.css';

const API_END_POINT = 'http://localhost:5000/api/sensor/data';
const THRESHOLD_ENDPOINT = 'http://localhost:5000/api/sensor/threshold';
const SOCKET_URL = 'http://localhost:5000';
const SESSION_STORAGE_KEY = 'iot-dashboard-session';

const DEFAULT_THRESHOLDS = {
  tempThreshold: 32,
  humidityThreshold: 40,
  humidityThresholdHigh: 75,
  co2Threshold: 1000,
  pm25Threshold: 35,
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [dataLogs, setDataLogs] = useState([]);
  const [errorSyncing, setErrorSyncing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('overview');
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);

  useEffect(() => {
    const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!savedSession) return;
    try {
      const parsedSession = JSON.parse(savedSession);
      if (parsedSession?.email && parsedSession?.role) {
        setSession(parsedSession);
      }
    } catch {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('iot-dashboard-theme');
    const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(preferredTheme);
    document.documentElement.setAttribute('data-theme', preferredTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    window.localStorage.setItem('iot-dashboard-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const fetchSensorLogs = useCallback(async () => {
    try {
      const response = await axios.get(API_END_POINT);
      setDataLogs(
        Array.isArray(response.data)
          ? response.data.slice(0, 40).map(log => ({
              timestamp: log.createdAt,
              temperature: log.temperature,
              humidity: log.humidity,
            }))
          : []
      );
    } catch (err) {
      setErrorSyncing(true);
      setDataLogs((currentLogs) => {
        const mockupReading = {
          timestamp: new Date().toISOString(),
          temperature: parseFloat((23 + Math.random() * 5).toFixed(1)),
          humidity: parseFloat((60 + Math.random() * 12).toFixed(1)),
        };
        return [mockupReading, ...currentLogs].slice(0, 40);
      });
    }
  }, []);

  const fetchThresholds = useCallback(async () => {
    try {
      const response = await axios.get(THRESHOLD_ENDPOINT);
      setThresholds(response.data);
    } catch (err) {
      console.error('Failed to load thresholds:', err);
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

    socket.on('connect', () => setIsLive(true));
    socket.on('disconnect', () => setIsLive(false));
    socket.on('newSensorData', (data) => {
      const reading = Array.isArray(data) ? data[0] : data;
      if (!reading) return;
      const newLog = {
        timestamp: reading.timestamp || new Date().toISOString(),
        temperature: reading.temperature,
        humidity: reading.humidity,
      };
      setDataLogs((currentLogs) => [newLog, ...currentLogs].slice(0, 40));
      setErrorSyncing(false);
    });

    return () => socket.disconnect();
  }, [session]);

  useEffect(() => {
    if (!session) return undefined;
    fetchSensorLogs();
    fetchThresholds();
    const runtimeInterval = setInterval(fetchSensorLogs, 3000);
    return () => clearInterval(runtimeInterval);
  }, [fetchSensorLogs, fetchThresholds, session]);

  const handleLogin = async (email, password) => {
    setIsAuthLoading(true);
    setLoginError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const { _id, token, name, role } = response.data;
      const nextSession = { _id, email, name, role, token };
      setSession(nextSession);
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      setIsAuthLoading(false);
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to authenticate. Please check your credentials and try again.';
      setLoginError(message);
      setIsAuthLoading(false);
      return false;
    }
  };

  const handleRegister = async (name, email, password) => {
    setIsAuthLoading(true);
    setLoginError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      const { _id, token, role } = response.data;
      const nextSession = { _id, email, name, role, token };
      setSession(nextSession);
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      setIsAuthLoading(false);
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to register account. Please check details and try again.';
      setLoginError(message);
      setIsAuthLoading(false);
      return false;
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    setDataLogs([]);
    setLoginError('');
  };

  const newestLog = dataLogs[0] || { temperature: 0, humidity: 0 };

  const warnings = {
    tempHigh: newestLog.temperature > thresholds.tempThreshold,
    humidityLow: newestLog.humidity < thresholds.humidityThreshold,
    humidityHigh: newestLog.humidity > thresholds.humidityThresholdHigh,
  };

  if (!session) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={loginError}
        loading={isAuthLoading}
      />
    );
  }

  return (
    <DashboardLayout
      activeSection={activeSection}
      onNavigate={setActiveSection}
      session={session}
      isLive={isLive}
      errorSyncing={errorSyncing}
      theme={theme}
      onToggleTheme={toggleTheme}
      onRefresh={fetchSensorLogs}
      onLogout={handleLogout}
    >
      <WarningBanner
        warnings={warnings}
        currentValues={{ temperature: newestLog.temperature, humidity: newestLog.humidity }}
        thresholds={thresholds}
      />

      {activeSection === 'overview' && (
        <>
          <WelcomeBanner name={session.name} role={session.role} isLive={isLive} />
          <div className="dl-cards-grid">
            <DashboardCard title="Temperature" value={newestLog.temperature} unit="°C" isTemp={true} highThreshold={thresholds.tempThreshold} />
            <DashboardCard title="Relative Humidity" value={newestLog.humidity} unit="%" isTemp={false} lowThreshold={thresholds.humidityThreshold} highThreshold={thresholds.humidityThresholdHigh} />
          </div>
          <EnvironmentalChart dataLogs={dataLogs} />
        </>
      )}

      {activeSection === 'telemetry' && <LiveFeed dataLogs={dataLogs} isLive={isLive} />}

      {activeSection === 'logs' && (
        <DataTable
          dataLogs={dataLogs}
          tempThreshold={thresholds.tempThreshold}
          humidityLow={thresholds.humidityThreshold}
          humidityHigh={thresholds.humidityThresholdHigh}
        />
      )}

      {activeSection === 'users' && session.role === 'admin' && (<ManageUsers session={session} />)}

      {activeSection === 'admin' && session.role === 'admin' && (
        <AdminControls session={session} onRefresh={fetchSensorLogs} onThresholdUpdate={fetchThresholds} />
      )}
    </DashboardLayout>
  );
}