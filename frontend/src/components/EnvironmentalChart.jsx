// src/components/dashboard/EnvironmentalChart.jsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Thermometer, Droplets } from 'lucide-react';
import './EnvironmentalChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Reads a CSS custom property off <html> and stays in sync with data-theme changes,
// since Chart.js options are plain JS and can't reference var() directly.
function useThemeTokens() {
  const [tokens, setTokens] = useState({
    text: '#171717',
    textSoft: '#525252',
    textMuted: '#a3a3a3',
    cardBorder: '#e5e5e5',
    panelStrong: '#ffffff',
  });

  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      const get = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
      setTokens({
        text: get('--text', '#171717'),
        textSoft: get('--text-soft', '#525252'),
        textMuted: get('--text-muted', '#a3a3a3'),
        cardBorder: get('--card-border', '#e5e5e5'),
        panelStrong: get('--panel-strong', '#ffffff'),
      });
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return tokens;
}

// Vertical fade-to-transparent fill under the line, drawn on the canvas itself.
function makeAreaGradient(ctx, chartArea, colorRgb) {
  if (!chartArea) return `rgba(${colorRgb}, 0.12)`;
  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, `rgba(${colorRgb}, 0.28)`);
  gradient.addColorStop(1, `rgba(${colorRgb}, 0)`);
  return gradient;
}

export default function EnvironmentalChart({ dataLogs }) {
  const tokens = useThemeTokens();

  // Take last 10 logs and display oldest to newest
  const chartData = [...dataLogs].reverse().slice(-10);

  const labels = chartData.map((log) => {
    const time = new Date(log.createdAt);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const temperatureConfig = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: chartData.map((log) => log.temperature),
        borderColor: '#f43f5e',
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          return makeAreaGradient(ctx, chartArea, '244, 63, 94');
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#f43f5e',
        pointHoverBorderColor: tokens.panelStrong,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const humidityConfig = {
    labels,
    datasets: [
      {
        label: 'Humidity (%)',
        data: chartData.map((log) => log.humidity),
        borderColor: '#3b82f6',
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          return makeAreaGradient(ctx, chartArea, '59, 130, 246');
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: tokens.panelStrong,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const getChartOptions = (unit) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tokens.panelStrong,
        titleColor: tokens.text,
        bodyColor: tokens.textSoft,
        borderColor: tokens.cardBorder,
        borderWidth: 1,
        padding: 10,
        titleFont: { size: 11, weight: '600', family: "'JetBrains Mono', monospace" },
        bodyFont: { size: 11, family: "'JetBrains Mono', monospace" },
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(1)}${unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: tokens.cardBorder, drawBorder: false },
        ticks: {
          color: tokens.textMuted,
          font: { size: 10, family: "'JetBrains Mono', monospace" },
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: { color: tokens.cardBorder, drawBorder: false },
        ticks: {
          color: tokens.textMuted,
          font: { size: 10, family: "'JetBrains Mono', monospace" },
          callback: (value) => `${value}${unit}`,
        },
      },
    },
    interaction: { intersect: false, mode: 'index' },
  });

  const latest = chartData[chartData.length - 1];
  const tempValues = chartData.map((d) => d.temperature);
  const humidityValues = chartData.map((d) => d.humidity);

  return (
    <div className="ec-container">
      <div className="ec-panel">
        <div className="ec-accent-bar ec-accent-temp" />
        <div className="ec-header">
          <h3>
            <Thermometer size={14} strokeWidth={2} className="ec-icon ec-icon-temp" />
            Temperature
          </h3>
          <div className="stats">
            <span className="stat stat-primary stat-temp">
              {latest ? latest.temperature.toFixed(1) : '--'}°C
            </span>
            <span className="stat">
              Min {tempValues.length ? Math.min(...tempValues).toFixed(1) : '--'}°
            </span>
            <span className="stat">
              Max {tempValues.length ? Math.max(...tempValues).toFixed(1) : '--'}°
            </span>
          </div>
        </div>
        <div className="ec-chart-wrapper">
          <Line data={temperatureConfig} options={getChartOptions('°C')} />
        </div>
      </div>

      <div className="ec-panel">
        <div className="ec-accent-bar ec-accent-humidity" />
        <div className="ec-header">
          <h3>
            <Droplets size={14} strokeWidth={2} className="ec-icon ec-icon-humidity" />
            Humidity
          </h3>
          <div className="stats">
            <span className="stat stat-primary stat-humidity">
              {latest ? latest.humidity.toFixed(1) : '--'}%
            </span>
            <span className="stat">
              Min {humidityValues.length ? Math.min(...humidityValues).toFixed(1) : '--'}%
            </span>
            <span className="stat">
              Max {humidityValues.length ? Math.max(...humidityValues).toFixed(1) : '--'}%
            </span>
          </div>
        </div>
        <div className="ec-chart-wrapper">
          <Line data={humidityConfig} options={getChartOptions('%')} />
        </div>
      </div>
    </div>
  );
}