// src/components/layout/Sidebar.jsx
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
    UserCog,
    User as UserIcon,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, shortcut: '1' },
    { id: 'telemetry', label: 'Live Telemetry', icon: Activity, shortcut: '2' },
    { id: 'logs', label: 'Data Logs', icon: Table2, shortcut: '3' },
    { id: 'profile', label: 'My Profile', icon: UserIcon, shortcut: '4' },
    {
        id: 'users',
        label: 'Manage Users',
        icon: UserCog,
        shortcut: '5',
        adminOnly: true
    },
    {
        id: 'admin',
        label: 'Admin',
        icon: ShieldCheck,
        shortcut: '6',       
        adminOnly: true       
    },
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
    role,
}) {
    const [isCollapsed, setIsCollapsed] = useCollapsedState();

    return (
        <>
            {isMobileOpen && (
                <div className="sidebar-overlay is-visible" onClick={onCloseMobile} aria-hidden="true" />
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
                    {!isCollapsed && <span className="sidebar-nav-eyebrow">Menu</span>}
                    <ul className="sidebar-nav-list">
                        {NAV_ITEMS.filter((item) =>!item.adminOnly || role === 'admin').map(({ id, label, icon: Icon, shortcut }) => {
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
                                        {!isCollapsed && (
                                            <>
                                                <span className="sidebar-nav-label">{label}</span>
                                                <kbd className="sidebar-nav-kbd">{shortcut}</kbd>
                                            </>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <div className={`sidebar-status ${isCollapsed ? 'is-collapsed' : ''} ${isLive ? 'is-live' : ''}`}>
                        <span className="sidebar-status-dot-wrap">
                            <CircleDot
                                size={12}
                                className={`sidebar-status-dot ${isLive ? 'is-live' : ''}`}
                                strokeWidth={2.5}
                            />
                        </span>
                        {!isCollapsed && <span>{isLive ? 'Connected' : 'Offline'}</span>}
                    </div>
                </div>
            </aside>
        </>
    );
}