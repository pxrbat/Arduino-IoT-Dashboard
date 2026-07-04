import React, { useState, useEffect } from 'react';
import { LockKeyhole, Sun, Moon, Zap } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage({ onLogin, error }) {
    const [email, setEmail] = useState('admin@iot.local');
    const [password, setPassword] = useState('admin123');
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = window.localStorage.getItem('iot-dashboard-theme');
        const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        setTheme(preferredTheme);
        document.documentElement.setAttribute('data-theme', preferredTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        window.localStorage.setItem('iot-dashboard-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin(email, password);
    };

    const usePreset = (presetEmail, presetPassword) => {
        setEmail(presetEmail);
        setPassword(presetPassword);
    };

    return (
        <div className="lp-wrapper">
            <div className="lp-header">
                <button type="button" className="lp-theme-btn" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                    {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
            </div>

            <main className="lp-page">
                <section className="lp-hero">
                    <div className="lp-brand">
                        <span className="lp-brand-mark"><Zap size={16} strokeWidth={2} /></span>
                        <div>
                            <p className="lp-kicker">Arduino IoT Dashboard</p>
                            <h1 className="lp-hero-title">Secure access for sensor operators</h1>
                        </div>
                    </div>

                    <p className="lp-copy">
                        Sign in to view live telemetry, compare trends, and open the admin tools for the ESP32 stack.
                    </p>

                    <div className="lp-stats">
                        <article className="lp-stat-card">
                            <strong>Live feed</strong>
                            <span>Socket-driven readings</span>
                        </article>
                        <article className="lp-stat-card">
                            <strong>Admin mode</strong>
                            <span>Threshold controls and log actions</span>
                        </article>
                    </div>
                </section>

                <section className="lp-card">
                    <div className="lp-card-header">
                        <span className="lp-card-badge">
                            <LockKeyhole size={12} />
                            Protected session
                        </span>
                        <h2 className="lp-card-title">Log in</h2>
                        <p className="lp-card-desc">Use one of the demo accounts below to enter the dashboard.</p>
                    </div>

                    <form className="lp-form" onSubmit={handleSubmit}>
                        <label className="lp-form-label">
                            Email
                            <div className="lp-field">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="name@company.com"
                                    autoComplete="username"
                                />
                            </div>
                        </label>

                        <label className="lp-form-label">
                            Password
                            <div className="lp-field">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                />
                            </div>
                        </label>

                        {error && <div className="lp-error">{error}</div>}

                        <button className="lp-submit" type="submit">
                            Enter dashboard
                        </button>
                    </form>

                    <div className="lp-presets">
                        <button type="button" className="lp-preset-btn" onClick={() => usePreset('admin@iot.local', 'admin123')}>
                            Admin demo
                        </button>
                        <button type="button" className="lp-preset-btn" onClick={() => usePreset('user@iot.local', 'user123')}>
                            Guest demo
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}