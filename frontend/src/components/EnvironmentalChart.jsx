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
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.05)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#09090b',
        pointBorderWidth: 2,
      },
      {
        label: 'Humidity (%)',
        data: chartData.map(log => log.humidity),
        borderColor: '#a1a1a6',
        backgroundColor: 'rgba(161, 161, 166, 0.05)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#a1a1a6',
        pointBorderColor: '#09090b',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a1a1a6',
          font: { size: 12, weight: '500' },
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: '#1a1a1f',
        titleColor: '#ffffff',
        bodyColor: '#a1a1a6',
        borderColor: '#4f46e5',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { color: '#1e1e24', drawBorder: false },
        ticks: { color: '#80808a', font: { size: 11 } },
      },
      y: {
        grid: { color: '#1e1e24', drawBorder: false },
        ticks: { color: '#80808a', font: { size: 11 } },
      },
    },
  };

  return (
    <div className="section-panel">
      <h3>Real-Time Environmental Fluctuations</h3>
      <div className="chart-wrapper">
        <Line data={datasetConfig} options={chartOptions} />
      </div>
    </div>
  );
}