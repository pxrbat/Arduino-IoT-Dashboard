import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Activity,
    Table2,
    ShieldCheck,
    ChevronsLeft,
    ChevronsRight,
    X,
    CircleDot,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'telemetry', label: 'Live Telemetry', icon: Activity },
    { id: 'logs', label: 'Data Logs', icon: Table2 },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
];

function useCollapsedState() {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const stored = window.localStorage.getItem('sidebar-collapsed');
        return stored === 'true';
    });

    useEffect(() => {
        window.localStorage.setItem('sidebar-collapsed', String(isCollapsed));
    }, [isCollapsed]);

    return [isCollapsed, setIsCollapsed];
}

export default function Sidebar({
    activeSection,
    onNavigate,
    isMobileOpen,
    onCloseMobile,
    orgName = 'IoT Dashboard',
    isLive = false,
}) {
    const [isCollapsed, setIsCollapsed] = useCollapsedState();

    return (
        <>
            {isMobileOpen && (
                <div className="sidebar-overlay" onClick={onCloseMobile} aria-hidden="true" />
            )}

            <aside className={`sidebar ${isCollapsed ? 'is-collapsed' : ''} ${isMobileOpen ? 'is-mobile-open' : ''}`}>
                <div className="sidebar-top">
                    {!isCollapsed && (
                        <div className="sidebar-brand">
                            <span className="sidebar-brand-mark">S</span>
                            <span className="sidebar-brand-name">{orgName}</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="sidebar-icon-btn sidebar-close-btn"
                        aria-label="Close menu"
                    >
                        <X size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsCollapsed((prev) => !prev)}
                        className="sidebar-icon-btn sidebar-collapse-btn"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul className="sidebar-nav-list">
                        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                            const isActive = activeSection === id;
                            return (
                                <li key={id}>
                                    <button
                                        type="button"
                                        onClick={() => onNavigate(id)}
                                        title={isCollapsed ? label : undefined}
                                        className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}
                                    >
                                        <Icon size={15} strokeWidth={1.75} className="sidebar-nav-icon" />
                                        {!isCollapsed && <span className="sidebar-nav-label">{label}</span>}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <div className={`sidebar-status ${isCollapsed ? 'is-collapsed' : ''}`}>
                        <CircleDot size={12} className={`sidebar-status-dot ${isLive ? 'is-live' : ''}`} strokeWidth={2.5} />
                        {!isCollapsed && <span>{isLive ? 'Connected' : 'Offline'}</span>}
                    </div>
                </div>
            </aside>
        </>
    );
}