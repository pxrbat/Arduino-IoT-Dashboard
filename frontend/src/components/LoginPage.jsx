import React, { useState, useEffect } from 'react';
import { LockKeyhole } from 'lucide-react';

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
        <div className="login-wrapper">
            <div className="login-page-header">
                <button className="theme-toggle-button" onClick={toggleTheme}>
                    {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>
            <main className="login-page">
            <section className="login-hero">
                <div className="login-brand">
                    <span className="login-brand-mark">
                        ⚡
                    </span>
                    <div>
                        <p className="login-kicker">Arduino IoT Dashboard</p>
                        <h1>Secure access for sensor operators</h1>
                    </div>
                </div>

                <p className="login-copy">
                    Sign in to view live telemetry, compare trends, and open the admin tools for the
                    ESP32 stack.
                </p>

                <div className="login-stats">
                    <article>
                        <strong>Live feed</strong>
                        <span>Socket-driven readings</span>
                    </article>
                    <article>
                        <strong>Admin mode</strong>
                        <span>Threshold controls and log actions</span>
                    </article>
                </div>
            </section>

            <section className="login-card">
                <div className="login-card-header">
                    <span className="login-card-badge">
                        <LockKeyhole size={13} />
                        Protected session
                    </span>
                    <h2>Log in</h2>
                    <p>Use one of the demo accounts below to enter the dashboard.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        Email
                        <div className="login-field">
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="name@company.com"
                                autoComplete="username"
                            />
                        </div>
                    </label>

                    <label>
                        Password
                        <div className="login-field">
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter password"
                                autoComplete="current-password"
                            />
                        </div>
                    </label>

                    {error && <div className="login-error">{error}</div>}

                    <button className="login-submit" type="submit">
                        Enter dashboard
                    </button>
                </form>

                <div className="login-presets">
                    <button type="button" onClick={() => usePreset('admin@iot.local', 'admin123')}>
                        Admin demo
                    </button>
                    <button type="button" onClick={() => usePreset('user@iot.local', 'user123')}>
                        Guest demo
                    </button>
                </div>
            </section>
        </main>
        </div>
    );
}