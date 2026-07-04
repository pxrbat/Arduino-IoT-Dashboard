// src/components/layout/DashboardLayout.jsx
import { useState } from 'react';
import { Menu, RefreshCw, LogOut, Sun, Moon } from 'lucide-react';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

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
            <Sidebar
                activeSection={activeSection}
                onNavigate={(id) => {
                    onNavigate(id);
                    setIsMobileOpen(false);
                }}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
                orgName="Sensor Ops"
                isLive={isLive}
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
                        <h1 className="dl-title">IoT Environmental Monitor</h1>
                    </div>

                    <div className="dl-header-right">
                        <span className={`dl-status-pill ${isLive ? 'is-live' : ''}`}>
                            {isLive ? 'Live' : 'Cached'}
                        </span>

                        {errorSyncing && <span className="dl-error-pill">Sync error</span>}

                        <button type="button" onClick={onToggleTheme} className="dl-icon-btn" aria-label="Toggle theme">
                            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                        </button>

                        <button type="button" onClick={onRefresh} className="dl-icon-btn" aria-label="Refresh data">
                            <RefreshCw size={15} />
                        </button>

                        <div className="dl-divider" />

                        <span className="dl-session-name">{session?.name}</span>

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