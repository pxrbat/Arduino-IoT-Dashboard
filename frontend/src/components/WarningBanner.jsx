import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Thermometer, Droplets, Wind, CloudHaze } from 'lucide-react';

/**
 * WarningBanner — renders animated alert banners when sensor values
 * breach configured thresholds. Also fires browser notifications.
 *
 * Props:
 *   warnings: { tempHigh, humidityLow, co2High, pm25High }
 *   currentValues: { temperature, humidity, co2, pm25 }
 *   thresholds: { tempThreshold, humidityThreshold, co2Threshold, pm25Threshold }
 */
export default function WarningBanner({ warnings = {}, currentValues = {}, thresholds = {} }) {
  const prevWarnings = useRef({});

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fire browser notifications when a NEW warning appears
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const prev = prevWarnings.current;

    if (warnings.tempHigh && !prev.tempHigh) {
      new Notification(' High Temperature Alert', {
        body: `Temperature is ${currentValues.temperature}°C — exceeds ${thresholds.tempThreshold}°C limit. Fan activated.`,
        tag: 'temp-warning',
      });
    }

    if (warnings.humidityLow && !prev.humidityLow) {
      new Notification('Low Humidity Alert', {
        body: `Humidity is ${currentValues.humidity}% — below ${thresholds.humidityThreshold}% limit. Mist maker activated.`,
        tag: 'humidity-warning',
      });
    }

    if (warnings.co2High && !prev.co2High) {
      new Notification(' High CO2 Alert', {
        body: `CO2 level is ${currentValues.co2} ppm — exceeds ${thresholds.co2Threshold} ppm safe limit.`,
        tag: 'co2-warning',
      });
    }

    if (warnings.pm25High && !prev.pm25High) {
      new Notification(' High PM2.5 Alert', {
        body: `PM2.5 is ${currentValues.pm25} µg/m³ — exceeds ${thresholds.pm25Threshold} µg/m³ safe limit.`,
        tag: 'pm25-warning',
      });
    }

    prevWarnings.current = { ...warnings };
  }, [warnings, currentValues, thresholds]);

  const activeWarnings = [];

  if (warnings.tempHigh) {
    activeWarnings.push({
      key: 'temp',
      icon: Thermometer,
      severity: 'critical',
      title: 'HIGH TEMPERATURE',
      detail: `${currentValues.temperature}°C exceeds ${thresholds.tempThreshold}°C — Fan Activated`,
    });
  }

  if (warnings.humidityLow) {
    activeWarnings.push({
      key: 'humidity',
      icon: Droplets,
      severity: 'warning',
      title: 'LOW HUMIDITY',
      detail: `${currentValues.humidity}% is below ${thresholds.humidityThreshold}% — Mist Maker Activated`,
    });
  }

  if (warnings.co2High) {
    activeWarnings.push({
      key: 'co2',
      icon: Wind,
      severity: 'critical',
      title: 'HIGH CO2 LEVEL',
      detail: `${currentValues.co2} ppm exceeds ${thresholds.co2Threshold} ppm safe limit`,
    });
  }

  if (warnings.pm25High) {
    activeWarnings.push({
      key: 'pm25',
      icon: CloudHaze,
      severity: 'warning',
      title: 'HIGH PM2.5 LEVEL',
      detail: `${currentValues.pm25} µg/m³ exceeds ${thresholds.pm25Threshold} µg/m³ safe limit`,
    });
  }

  if (activeWarnings.length === 0) return null;

  return (
    <div className="warning-banner-container">
      {activeWarnings.map((w) => {
        const Icon = w.icon;
        return (
          <div key={w.key} className={`warning-banner warning-${w.severity}`}>
            <div className="warning-banner-content">
              <AlertTriangle size={18} className="warning-pulse-icon" />
              <Icon size={18} />
              <span className="warning-title">{w.title}</span>
              <span className="warning-detail">{w.detail}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
