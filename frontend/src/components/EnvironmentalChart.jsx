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

  const datasetConfig = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: chartData.map(log => log.temperature),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.04)',
        tension: 0.25,
        borderWidth: 1.5,
        pointRadius: 2,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
      },
      {
        label: 'Humidity (%)',
        data: chartData.map(log => log.humidity),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.04)',
        tension: 0.25,
        borderWidth: 1.5,
        pointRadius: 2,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#737373',
          font: { size: 11, weight: '500' },
          usePointStyle: true,
          padding: 12,
          boxHeight: 6,
          boxWidth: 6,
        },
      },
      tooltip: {
        backgroundColor: '#171717',
        titleColor: '#ffffff',
        bodyColor: '#d4d4d4',
        borderColor: '#404040',
        borderWidth: 1,
        padding: 8,
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { color: '#f0f0f0', drawBorder: false },
        ticks: { color: '#a3a3a3', font: { size: 10 } },
      },
      y: {
        grid: { color: '#f0f0f0', drawBorder: false },
        ticks: { color: '#a3a3a3', font: { size: 10 } },
      },
    },
  };

  return (
    <div className="ec-panel">
      <h3>Real-Time Environmental Fluctuations</h3>
      <div className="ec-chart-wrapper">
        <Line data={datasetConfig} options={chartOptions} />
      </div>
    </div>
  );
}