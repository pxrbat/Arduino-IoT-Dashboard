import React from 'react';
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
import './EnvironmentalChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function EnvironmentalChart({ dataLogs }) {
  // Take last 10 logs and display oldest to newest
  const chartData = [...dataLogs].reverse().slice(-10);

  const labels = chartData.map(log => {
    const time = new Date(log.timestamp);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  // Temperature chart configuration
  const temperatureConfig = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: chartData.map(log => log.temperature),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointHoverRadius: 6,
      },
    ],
  };

  // Humidity chart configuration
  const humidityConfig = {
    labels,
    datasets: [
      {
        label: 'Humidity (%)',
        data: chartData.map(log => log.humidity),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointHoverRadius: 6,
      },
    ],
  };

  // Shared chart options
  const getChartOptions = (label, color) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          color: '#737373',
          font: { size: 12, weight: '600' },
          usePointStyle: true,
          padding: 16,
          boxHeight: 8,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#171717',
        titleColor: '#ffffff',
        bodyColor: '#d4d4d4',
        borderColor: '#404040',
        borderWidth: 1,
        padding: 10,
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 12 },
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { 
          color: 'rgba(0,0,0,0.05)', 
          drawBorder: false,
        },
        ticks: { 
          color: '#a3a3a3', 
          font: { size: 10 },
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: { 
          color: 'rgba(0,0,0,0.05)', 
          drawBorder: false,
        },
        ticks: { 
          color: '#a3a3a3', 
          font: { size: 10 },
          callback: function(value) {
            return value + (label === 'Temperature' ? '°C' : '%');
          }
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  });

  return (
    <div className="ec-container">
      <div className="ec-panel temperature-panel">
        <div className="ec-header">
          <h3>
            
            Temperature
          </h3>
          <div className="stats">
            <span className="stat">
              Current: {chartData.length > 0 ? chartData[chartData.length - 1].temperature.toFixed(1) : '--'}°C
            </span>
            <span className="stat">
              Min: {chartData.length > 0 ? Math.min(...chartData.map(d => d.temperature)).toFixed(1) : '--'}°C
            </span>
            <span className="stat">
              Max: {chartData.length > 0 ? Math.max(...chartData.map(d => d.temperature)).toFixed(1) : '--'}°C
            </span>
          </div>
        </div>
        <div className="ec-chart-wrapper">
          <Line data={temperatureConfig} options={getChartOptions('Temperature', '#dc2626')} />
        </div>
      </div>

      <div className="ec-panel humidity-panel">
        <div className="ec-header">
          <h3>
            
            Humidity
          </h3>
          <div className="stats">
            <span className="stat">
              Current: {chartData.length > 0 ? chartData[chartData.length - 1].humidity.toFixed(1) : '--'}%
            </span>
            <span className="stat">
              Min: {chartData.length > 0 ? Math.min(...chartData.map(d => d.humidity)).toFixed(1) : '--'}%
            </span>
            <span className="stat">
              Max: {chartData.length > 0 ? Math.max(...chartData.map(d => d.humidity)).toFixed(1) : '--'}%
            </span>
          </div>
        </div>
        <div className="ec-chart-wrapper">
          <Line data={humidityConfig} options={getChartOptions('Humidity', '#2563eb')} />
        </div>
      </div>
    </div>
  );
}