// src/components/Avatar.jsx
import React from 'react';

export default function Avatar({ name, color, size = 36 }) {
  const initials = (name || '?')
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: color || '#2563eb',
        color: '#ffffff',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        fontSize: size * 0.4,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials || '?'}
    </div>
  );
}