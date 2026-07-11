// src/components/LoginPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { LockKeyhole, Sun, Moon, Zap, Eye, EyeOff, Loader2, Activity, Radio, SlidersHorizontal, BarChart3, User } from 'lucide-react';
import './LoginPage.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SYSTEM_STATUS = [
    { label: 'Backend', state: 'online' },
    { label: 'Database', state: 'online' },
    { label: 'WebSocket', state: 'online' },
    { label: 'Sensor node', state: 'waiting' },
];

export default function LoginPage({ onLogin, onRegister, error, loading = false }) {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [touched, setTouched] = useState({ name: false, email: false, password: false });
    const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '' });
    const [mounted, setMounted] = useState(false);

    const submittingRef = useRef(false);

    useEffect(() => {
        const savedTheme = window.localStorage.getItem('iot-dashboard-theme');
        const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        setTheme(preferredTheme);
        document.documentElement.setAttribute('data-theme', preferredTheme);
        requestAnimationFrame(() => setMounted(true));
    }, []);

    useEffect(() => {
        if (!loading) {
            submittingRef.current = false;
        }
    }, [loading]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        window.localStorage.setItem('iot-dashboard-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const validate = (values) => {
        const errors = { name: '', email: '', password: '' };

        if (isRegisterMode && !values.name.trim()) {
            errors.name = 'Full name is required.';
        }

        if (!values.email.trim()) {
            errors.email = 'Email is required.';
        } else if (!EMAIL_REGEX.test(values.email.trim())) {
            errors.email = 'Enter a valid email address.';
        }

        if (!values.password) {
            errors.password = 'Password is required.';
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }

        return errors;
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setFieldErrors(validate({ name, email, password }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const errors = validate({ name, email, password });
        setFieldErrors(errors);
        setTouched({ name: true, email: true, password: true });

        const hasErrors = Boolean(
            (isRegisterMode && errors.name) || errors.email || errors.password
        );
        if (hasErrors || submittingRef.current || loading) return;

        submittingRef.current = true;
        if (isRegisterMode) {
            onRegister(name.trim(), email.trim(), password);
        } else {
            onLogin(email.trim(), password);
        }
    };

    const usePreset = (presetEmail, presetPassword) => {
        setIsRegisterMode(false);
        setEmail(presetEmail);
        setPassword(presetPassword);
        setName('');
        setTouched({ name: false, email: false, password: false });
        setFieldErrors({ name: '', email: '', password: '' });
    };

    const isBusy = loading;

    return (
        <div className={`lp-wrapper ${mounted ? 'lp-mounted' : ''}`}>
            <div className="lp-header">
                <button
                    type="button"
                    className="lp-theme-btn"
                    onClick={toggleTheme}
                    aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                >
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                    {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
            </div>

            <main className="lp-page">
                <section className="lp-hero">
                    <div className="lp-brand">
                        <span className="lp-brand-mark"><Zap size={16} strokeWidth={2} /></span>
                        <div>
                            <p className="lp-kicker">Environmental Monitoring</p>
                            <h1 className="lp-hero-title">Secure access for sensor operators</h1>
                        </div>
                    </div>

                    <p className="lp-copy">
                        Sign in to view live telemetry, compare trends, and open the admin tools for the monitoring stack.
                    </p>

                    <div className="lp-stats">
                        <article className="lp-stat-card">
                            <span className="lp-stat-icon"><Activity size={14} /></span>
                            <strong>Real-time Monitoring</strong>
                            <span>Live dashboard updates as readings change</span>
                        </article>
                        <article className="lp-stat-card">
                            <span className="lp-stat-icon"><Radio size={14} /></span>
                            <strong>Live Sensor Telemetry</strong>
                            <span>Socket-driven data streams</span>
                        </article>
                        <article className="lp-stat-card">
                            <span className="lp-stat-icon"><SlidersHorizontal size={14} /></span>
                            <strong>Threshold Management</strong>
                            <span>Configure alert bounds per sensor</span>
                        </article>
                        <article className="lp-stat-card">
                            <span className="lp-stat-icon"><BarChart3 size={14} /></span>
                            <strong>Historical Analytics</strong>
                            <span>Trend charts across custom ranges</span>
                        </article>
                    </div>

                    <div className="lp-status-card" role="status" aria-label="System status">
                        <p className="lp-status-title">System Status</p>
                        <ul className="lp-status-list">
                            {SYSTEM_STATUS.map((item) => (
                                <li className="lp-status-item" key={item.label}>
                                    <span className={`lp-status-dot lp-status-dot--${item.state}`} aria-hidden="true" />
                                    <span className="lp-status-label">{item.label}</span>
                                    <span className={`lp-status-value lp-status-value--${item.state}`}>
                                        {item.state === 'online' ? 'Connected' : item.state === 'waiting' ? 'Waiting...' : 'Offline'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="lp-card">
                    <div className="lp-card-header">
                        <span className="lp-card-badge">
                            <LockKeyhole size={12} />
                            Protected session
                        </span>
                        <h2 className="lp-card-title">{isRegisterMode ? 'Register Account' : 'Log in'}</h2>
                        <p className="lp-card-desc">
                            {isRegisterMode
                                ? 'Create an operator account to access the IoT dashboard.'
                                : 'Use credentials or one of the demo accounts below to enter.'}
                        </p>
                    </div>

                    <form className="lp-form" onSubmit={handleSubmit} noValidate>
                        {isRegisterMode && (
                            <label className="lp-form-label" htmlFor="lp-name">
                                Full Name
                                <div className={`lp-field ${touched.name && fieldErrors.name ? 'lp-field--invalid' : ''}`}>
                                    <input
                                        id="lp-name"
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        onBlur={() => handleBlur('name')}
                                        placeholder=""
                                        autoComplete="name"
                                        aria-invalid={Boolean(touched.name && fieldErrors.name)}
                                        aria-describedby={fieldErrors.name ? 'lp-name-error' : undefined}
                                        disabled={isBusy}
                                    />
                                </div>
                                {touched.name && fieldErrors.name && (
                                    <span className="lp-field-error" id="lp-name-error" role="alert">
                                        {fieldErrors.name}
                                    </span>
                                )}
                            </label>
                        )}

                        <label className="lp-form-label" htmlFor="lp-email">
                            Email
                            <div className={`lp-field ${touched.email && fieldErrors.email ? 'lp-field--invalid' : ''}`}>
                                <input
                                    id="lp-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    placeholder=""
                                    autoComplete="username"
                                    aria-invalid={Boolean(touched.email && fieldErrors.email)}
                                    aria-describedby={fieldErrors.email ? 'lp-email-error' : undefined}
                                    disabled={isBusy}
                                />
                            </div>
                            {touched.email && fieldErrors.email && (
                                <span className="lp-field-error" id="lp-email-error" role="alert">
                                    {fieldErrors.email}
                                </span>
                            )}
                        </label>

                        <label className="lp-form-label" htmlFor="lp-password">
                            Password
                            <div className={`lp-field ${touched.password && fieldErrors.password ? 'lp-field--invalid' : ''}`}>
                                <input
                                    id="lp-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    placeholder=""
                                    autoComplete="current-password"
                                    aria-invalid={Boolean(touched.password && fieldErrors.password)}
                                    aria-describedby={fieldErrors.password ? 'lp-password-error' : undefined}
                                    disabled={isBusy}
                                />
                                <button
                                    type="button"
                                    className="lp-password-toggle"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    aria-pressed={showPassword}
                                    disabled={isBusy}
                                    tabIndex={0}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {touched.password && fieldErrors.password && (
                                <span className="lp-field-error" id="lp-password-error" role="alert">
                                    {fieldErrors.password}
                                </span>
                            )}
                        </label>

                        {error && (
                            <div className="lp-error" role="alert">
                                {error}
                            </div>
                        )}

                        <button className="lp-submit" type="submit" disabled={isBusy} aria-busy={isBusy}>
                            {isBusy ? (
                                <>
                                    <Loader2 size={15} className="lp-spinner" aria-hidden="true" />
                                    {isRegisterMode ? 'Registering...' : 'Authenticating...'}
                                </>
                            ) : (
                                isRegisterMode ? 'Register account' : 'Enter dashboard'
                            )}
                        </button>
                    </form>

                    <div className="lp-toggle-mode">
                        {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            type="button"
                            className="lp-toggle-btn"
                            onClick={() => {
                                setIsRegisterMode(!isRegisterMode);
                                setTouched({ name: false, email: false, password: false });
                                setFieldErrors({ name: '', email: '', password: '' });
                            }}
                            disabled={isBusy}
                        >
                            {isRegisterMode ? 'Log in' : 'Register'}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}