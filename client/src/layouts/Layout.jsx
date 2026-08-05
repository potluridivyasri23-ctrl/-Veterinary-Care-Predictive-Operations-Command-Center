import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const navGroups = [
  {
    group: 'Clinical',
    items: [
      { label: 'Dashboard',        path: '/',                icon: '🏠' },
      { label: 'Appointments',     path: '/appointments',    icon: '📅' },
      { label: 'Animals',          path: '/animals',         icon: '🐾' },
      { label: 'Owners',           path: '/owners',          icon: '👤' },
      { label: 'Medical Records',  path: '/medical-records', icon: '📋' },
      { label: 'Diagnostics',      path: '/diagnostics',     icon: '🔬' },
      { label: 'Treatments',       path: '/treatments',      icon: '💊' },
      { label: 'Vaccinations',     path: '/vaccinations',    icon: '💉' },
      { label: 'Follow-ups',       path: '/follow-ups',      icon: '🔁' },
    ],
  },
  {
    group: 'Operations',
    items: [
      { label: 'Workflow Queues',  path: '/workflow-queues', icon: '⚙️' },
      { label: 'Alerts',           path: '/alerts',          icon: '🔔', badge: 'alerts' },
      { label: 'Notifications',    path: '/notifications',   icon: '📣', badge: 'notifications' },
      { label: 'Anomalies',        path: '/anomalies',       icon: '⚠️' },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { label: 'Analytics',        path: '/analytics',       icon: '📊' },
      { label: 'Forecasts',        path: '/forecast',        icon: '📈' },
      { label: 'Risk Analysis',    path: '/risk-analysis',   icon: '🛡️' },
      { label: 'Scenario Planning',path: '/scenario-planning',icon: '🗺️' },
      { label: 'Reports',          path: '/reports',         icon: '📄' },
    ],
  },
  {
    group: 'Admin',
    items: [
      { label: 'Users',            path: '/users',           icon: '👥' },
      { label: 'Audit Logs',       path: '/audit-logs',      icon: '🗂️' },
      { label: 'Configuration',    path: '/configurations',  icon: '🔧' },
      { label: 'AI Insights',      path: '/ai',              icon: '🤖' },
    ],
  },
];

function Layout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout, user } = useAuth();
  const [alertCount, setAlertCount]             = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [sidebarOpen, setSidebarOpen]           = useState(true);

  const refreshCounts = async () => {
    try {
      const [aRes, nRes] = await Promise.all([
        api.get('/alerts'),
        api.get('/notifications'),
      ]);
      setAlertCount(aRes.data.length);
      setNotificationCount(nRes.data.filter((n) => !n.read).length);
    } catch {
      setAlertCount(0);
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    refreshCounts();
    const id = setInterval(refreshCounts, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { refreshCounts(); }, [location.pathname]);

  const pageTitle = location.pathname === '/'
    ? 'Dashboard'
    : location.pathname.split('/').filter(Boolean)
        .map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
        .join(' › ');

  const SIDEBAR_W = sidebarOpen ? 260 : 72;
  const TOPBAR_H  = 60;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', background: '#f0f4ff' }}>

      {/* ── SIDEBAR ──────────────────────────────── */}
      <aside style={{
        width: SIDEBAR_W,
        minWidth: SIDEBAR_W,
        height: '100vh',
        background: 'linear-gradient(180deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        boxShadow: '4px 0 24px rgba(37,99,235,0.18)',
        zIndex: 200,
        position: 'fixed',
        top: 0,
        left: 0,
      }}>
        {/* Sidebar logo strip */}
        <div style={{ height: TOPBAR_H, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🐾</div>
          {sidebarOpen && (
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>VetOps Command</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 8px' }} className="scrollable">
          {navGroups.map((grp) => (
            <div key={grp.group} style={{ marginBottom: 8 }}>
              {sidebarOpen && (
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', padding: '8px 10px 4px' }}>
                  {grp.group}
                </div>
              )}
              {grp.items.map((item) => {
                const isActive = location.pathname === item.path;
                const badgeCount = item.badge === 'alerts' ? alertCount : item.badge === 'notifications' ? notificationCount : 0;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    title={!sidebarOpen ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: sidebarOpen ? '9px 12px' : '9px 0',
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.72)',
                      fontWeight: isActive ? 700 : 400,
                      fontSize: 13.5,
                      transition: 'background 0.15s, color 0.15s',
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,0.22)' : 'none',
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
                    {sidebarOpen && (
                      <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                    )}
                    {sidebarOpen && badgeCount > 0 && (
                      <span style={{ background: '#ef4444', color: '#fff', borderRadius: 12, fontSize: 11, fontWeight: 700, padding: '1px 7px', minWidth: 20, textAlign: 'center' }}>
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User info at bottom */}
        <div style={{ padding: '12px 12px', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 14, flexShrink: 0 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, textTransform: 'capitalize' }}>{user?.role || 'Staff'}</div>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', color: '#fff', fontSize: 12, flexShrink: 0 }}
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              onClick={() => { logout(); navigate('/login'); }}
              title="Logout"
              style={{ width: '100%', background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '8px 0', cursor: 'pointer', color: '#fff', fontSize: 16 }}
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* ── RIGHT SIDE (topbar + content) ──────── */}
      <div style={{ marginLeft: SIDEBAR_W, flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', transition: 'margin-left 0.25s ease', overflow: 'hidden' }}>

        {/* TOP BAR */}
        <header style={{
          height: TOPBAR_H,
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          gap: 16,
          flexShrink: 0,
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          zIndex: 100,
        }}>
          {/* Page title */}
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{pageTitle}</span>
            <span style={{ marginLeft: 10, fontSize: 12, color: '#94a3b8' }}>Operations & Clinical Command Center</span>
          </div>

          {/* Badges */}
          <button
            onClick={() => navigate('/alerts')}
            style={{ position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            🔔 Alerts
            {alertCount > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', borderRadius: 12, fontSize: 11, fontWeight: 700, padding: '0 6px', minWidth: 18, textAlign: 'center' }}>{alertCount}</span>
            )}
          </button>

          <button
            onClick={() => navigate('/notifications')}
            style={{ position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            📣 Inbox
            {notificationCount > 0 && (
              <span style={{ background: '#2563eb', color: '#fff', borderRadius: 12, fontSize: 11, fontWeight: 700, padding: '0 6px', minWidth: 18, textAlign: 'center' }}>{notificationCount}</span>
            )}
          </button>

          <button
            onClick={refreshCounts}
            title="Refresh data"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', fontSize: 15, color: '#475569' }}
          >
            🔄
          </button>

          {/* User chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '6px 12px' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{user?.name || 'User'}</span>
            <span style={{ fontSize: 11, color: '#64748b', textTransform: 'capitalize', background: '#dbeafe', borderRadius: 6, padding: '2px 6px' }}>{user?.role || 'staff'}</span>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main
          className="scrollable"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 32px',
            background: 'linear-gradient(160deg, #f0f4ff 0%, #e8f0fe 100%)',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
