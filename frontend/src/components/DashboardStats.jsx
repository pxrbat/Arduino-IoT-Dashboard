// src/components/DashboardStats.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Users, ShieldCheck, Database, Thermometer, Droplets, Clock } from 'lucide-react';
import './DashboardStats.css';

const API_BASE = 'http://localhost:5000/api/stats';

export default function DashboardStats({ session }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const authHeaders = {
    headers: { Authorization: `Bearer ${session.token}` },
  };

  const loadStats = useCallback(async () => {
    try {
      const response = await axios.get(API_BASE, authHeaders);
      setStats(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats.');
    }
  }, [session.token]);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 15000);
    return () => clearInterval(interval);
  }, [loadStats]);

  if (error) {
    return <div className="ds-error">{error}</div>;
  }

  if (!stats) {
    return null;
  }

  const lastReadingLabel = stats.lastReadingAt
    ? new Date(stats.lastReadingAt).toLocaleString()
    : 'No readings yet';

  const tiles = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users },
    { label: 'Admins', value: stats.adminCount, icon: ShieldCheck },
    { label: 'Total Readings', value: stats.totalReadings, icon: Database },
    { label: 'Avg Temperature', value: stats.averageTemperature !== null ? `${stats.averageTemperature}°C` : '--', icon: Thermometer },
    { label: 'Avg Humidity', value: stats.averageHumidity !== null ? `${stats.averageHumidity}%` : '--', icon: Droplets },
    { label: 'Last Reading', value: lastReadingLabel, icon: Clock, isSmall: true },
  ];

  return (
    <div className="ds-grid">
      {tiles.map(({ label, value, icon: Icon, isSmall }) => (
        <div className="ds-tile" key={label}>
          <div className="ds-tile-icon">
            <Icon size={14} strokeWidth={2} />
          </div>
          <div className="ds-tile-body">
            <span className="ds-tile-label">{label}</span>
            <span className={`ds-tile-value ${isSmall ? 'is-small' : ''}`}>{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}