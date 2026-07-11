// src/components/Livefeed.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Radio } from 'lucide-react';
import './Livefeed.css';

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour12: false });
  } catch {
    return '--:--:--';
  }
}

function tempTone(temp) {
  if (temp == null || Number.isNaN(temp)) return 'neutral';
  if (temp < 22) return 'cool';
  if (temp < 27) return 'mild';
  return 'warm';
}

export default function LiveFeed({ dataLogs, isLive }) {
  const [secondsAgo, setSecondsAgo] = useState(0);
  const lastTimestampRef = useRef(null);

  useEffect(() => {
    if (dataLogs[0]?.timestamp) {
      lastTimestampRef.current = dataLogs[0].timestamp;
      setSecondsAgo(0);
    }
  }, [dataLogs]);

  useEffect(() => {
    const tick = setInterval(() => {
      if (lastTimestampRef.current) {
        const diff = Math.max(
          0,
          Math.floor((Date.now() - new Date(lastTimestampRef.current).getTime()) / 1000)
        );
        setSecondsAgo(diff);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const recent = dataLogs.slice(0, 6);

  return (
    <section className="live-feed-panel">
      <div className="live-feed-header">
        <div className="live-feed-title">
          <Radio size={13} strokeWidth={2} />
          <span>Live Feed</span>
        </div>
        <div className={`live-feed-status ${isLive ? 'is-live' : 'is-offline'}`}>
          <span className="live-feed-dot" />
          {isLive ? `last packet ${secondsAgo}s ago` : 'offline — showing cached feed'}
        </div>
      </div>

      <ol className="live-feed-list">
        {recent.length === 0 && (
          <li className="live-feed-empty">Waiting for the first reading…</li>
        )}
        {recent.map((log, idx) => (
          <li
            key={`${log.timestamp}-${idx}`}
            className={`live-feed-row tone-${tempTone(log.temperature)} ${idx === 0 ? 'is-newest' : ''}`}
          >
            <span className="live-feed-tag">RX</span>
            <span className="live-feed-time">{formatTime(log.timestamp)}</span>
            <span className="live-feed-reading">
              {Number(log.temperature).toFixed(1)}°C
            </span>
            <span className="live-feed-reading">
              {Number(log.humidity).toFixed(1)}%
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}