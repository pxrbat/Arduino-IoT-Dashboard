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
        borderColor: '#222',
        backgroundColor: 'rgba(34,34,34,0.07)',
        tension: 0.2,
      },
      {
        label: 'Humidity (%)',
        data: chartData.map(log => log.humidity),
        borderColor: '#888',
        backgroundColor: 'rgba(136,136,136,0.07)',
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
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