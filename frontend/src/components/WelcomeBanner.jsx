// src/components/WelcomeBanner.jsx
import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import './WelcomeBanner.css';

function getGreeting(hour) {
  if (hour < 5) return 'Still up';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function WelcomeBanner({ name, role, isLive }) {
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Trigger the entrance animation on the next frame rather than
    // immediately, so the browser actually renders the "before" state
    // first and the CSS transition has something to animate from.
    const frame = requestAnimationFrame(() => setIsMounted(true));

    // Keep the date/greeting fresh if someone leaves the tab open.
    const interval = setInterval(() => setNow(new Date()), 60 * 1000);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
    };
  }, []);

  const firstName = name?.trim().split(' ')[0] || 'there';
  const greeting = getGreeting(now.getHours());
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`wb-hero ${isMounted ? 'is-mounted' : ''}`}>
      <div className="wb-hero-glow" aria-hidden="true" />
      <div className="wb-hero-grid" aria-hidden="true" />

      <div className="wb-hero-content">
        <span className="wb-hero-badge">
          <Sparkles size={11} strokeWidth={2} />
          {role === 'admin' ? 'Administrator access' : 'Member access'}
          <span className={`wb-hero-dot ${isLive ? 'is-live' : ''}`} />
        </span>

        <h1 className="wb-hero-title">
          {greeting}, <span className="wb-hero-name">{firstName}</span>
        </h1>

        <p className="wb-hero-subtitle">
          {dateLabel} — here's what your sensors are reporting right now.
        </p>
      </div>
    </div>
  );
}