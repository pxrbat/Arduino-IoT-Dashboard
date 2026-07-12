// src/components/layout/DashboardLayout.jsx
import { useState } from 'react';
import { Menu, RefreshCw, LogOut, Sun, Moon, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import './DashboardLayout.css';
import Avatar from '../Avatar';

const SECTION_LABELS = {
    overview: 'Overview',
    telemetry: 'Live Telemetry',
    logs: 'Data Logs',
    users: 'Manage Users',
    admin: 'Admin',
};

function getInitials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export default function DashboardLayout({
    children,
    activeSection,
    onNavigate,
    session,
    isLive,
    errorSyncing,
    theme,
    onToggleTheme,
    onRefresh,
    onLogout,
}) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="dl-shell">
            <div className="dl-accent-line" />

            <Sidebar
                activeSection={activeSection}
                onNavigate={(id) => {
                    onNavigate(id);
                    setIsMobileOpen(false);
                }}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
                orgName="IoT Dashboard"
                isLive={isLive}
                role={session.role}
            />

            <div className="dl-main-col">
                <header className="dl-header">
                    <div className="dl-header-left">
                        <button
                            type="button"
                            onClick={() => setIsMobileOpen(true)}
                            className="dl-icon-btn dl-menu-btn"
                            aria-label="Open menu"
                        >
                            <Menu size={17} />
                        </button>

                        <div className="dl-breadcrumb">
                            <span className="dl-breadcrumb-root">iot-dashboard</span>
                            <ChevronRight size={13} className="dl-breadcrumb-sep" />
                            <span className="dl-breadcrumb-current">
                                {SECTION_LABELS[activeSection] ?? activeSection}
                            </span>
                        </div>
                    </div>

                    <div className="dl-header-right">
                        <span className={`dl-status-pill ${isLive ? 'is-live' : ''}`}>
                            <span className="dl-status-dot" />
                            {isLive ? 'Live' : 'Cached'}
                        </span>

                        {errorSyncing && <span className="dl-error-pill">Sync error</span>}

                        <button type="button" onClick={onToggleTheme} className="dl-icon-btn" aria-label="Toggle theme">
                            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                        </button>

                        <button
                            type="button"
                            onClick={onRefresh}
                            className="dl-icon-btn dl-refresh-btn"
                            aria-label="Refresh data"
                        >
                            <RefreshCw size={15} />
                            <kbd className="dl-kbd">R</kbd>
                        </button>

                        <div className="dl-divider" />

                        <div className="dl-session">
                            <span className="dl-session-avatar">
                                <Avatar 
                                    name={session?.name}
                                    color={session?.avatarColor}
                                    size={24}
                                />
                            </span>
                            <span className="dl-session-name">{session?.name}</span>
                        </div>

                        <button type="button" onClick={onLogout} className="dl-logout-btn">
                            <LogOut size={13} />
                            <span className="dl-logout-label">Sign out</span>
                        </button>
                    </div>
                </header>

                <main className="dl-content">
                    <div className="dl-content-inner">{children}</div>
                </main>
            </div>
        </div>
    );
}