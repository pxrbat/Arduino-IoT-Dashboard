import React, { useState } from 'react';
import { Cpu, LockKeyhole, Mail, ShieldCheck, Sparkles, User } from 'lucide-react';

export default function LoginPage({ onLogin, error }) {
    const [email, setEmail] = useState('admin@iot.local');
    const [password, setPassword] = useState('admin123');

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin(email, password);
    };

    const usePreset = (presetEmail, presetPassword) => {
        setEmail(presetEmail);
        setPassword(presetPassword);
    };

    return (
        <main className="login-page">
            <section className="login-hero">
                <div className="login-brand">
                    <span className="login-brand-mark">
                        <Cpu size={18} />
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
                        <LockKeyhole size={14} />
                        Protected session
                    </span>
                    <h2>Log in</h2>
                    <p>Use one of the demo accounts below to enter the dashboard.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        Email
                        <div className="login-field">
                            <Mail size={16} />
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
                            <LockKeyhole size={16} />
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
                        <Sparkles size={16} />
                        Enter dashboard
                    </button>
                </form>

                <div className="login-presets">
                    <button type="button" onClick={() => usePreset('admin@iot.local', 'admin123')}>
                        <ShieldCheck size={15} />
                        Admin demo
                    </button>
                    <button type="button" onClick={() => usePreset('user@iot.local', 'user123')}>
                        <User size={15} />
                        Guest demo
                    </button>
                </div>
            </section>
        </main>
    );
}