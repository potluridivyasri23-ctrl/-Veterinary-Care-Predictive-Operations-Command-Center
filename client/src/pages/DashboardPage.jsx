import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ACCENT = '#2563eb';

function StatCard({ icon, label, value, color = ACCENT, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '22px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        boxShadow: '0 2px 12px rgba(37,99,235,0.08)',
        border: '1px solid #e2e8f0',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(37,99,235,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,0.08)';
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 14,
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, whiteSpace: 'normal', overflowWrap: 'break-word' }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{value ?? '—'}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(37,99,235,0.06)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{title}</span>
      </div>
      <div style={{ padding: '6px 0' }}>{children}</div>
    </div>
  );
}

function ListRow({ primary, secondary, badge, badgeColor = '#2563eb' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '11px 22px',
      borderBottom: '1px solid #f8fafc',
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b' }}>{primary}</div>
        {secondary && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{secondary}</div>}
      </div>
      {badge && (
        <span style={{ background: `${badgeColor}15`, color: badgeColor, borderRadius: 8, fontSize: 11, fontWeight: 700, padding: '3px 10px' }}>{badge}</span>
      )}
    </div>
  );
}

const KPI_META = {
  total_appointments:   { icon: '📅', label: 'Total Appointments', color: '#2563eb', path: '/appointments' },
  todays_appointments:  { icon: '🗓️', label: "Today's Appointments", color: '#0ea5e9', path: '/appointments' },
  active_animals:       { icon: '🐾', label: 'Active Animals',       color: '#10b981', path: '/animals' },
  pending_follow_ups:   { icon: '🔁', label: 'Pending Follow-ups',   color: '#f59e0b', path: '/follow-ups' },
  total_owners:         { icon: '👤', label: 'Total Owners',         color: '#8b5cf6', path: '/owners' },
  open_alerts:          { icon: '🔔', label: 'Open Alerts',          color: '#ef4444', path: '/alerts' },
  unread_notifications: { icon: '📣', label: 'Unread Notifications', color: '#f97316', path: '/notifications' },
  pending_treatments:   { icon: '💊', label: 'Pending Treatments',   color: '#06b6d4', path: '/treatments' },
};

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = () => {
    setLoading(true);
    api.get('/analytics/dashboard')
      .then((r) => setDashboard(r.data))
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e2e8f0', borderTopColor: ACCENT, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#94a3b8', fontSize: 14 }}>Loading dashboard data…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Failed to load dashboard data.</div>
        <div style={{ fontSize: 13, marginTop: 6, marginBottom: 20 }}>Please check your server connection or click retry below.</div>
        <button
          onClick={fetchDashboard}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
          }}
        >
          🔄 Retry Loading Dashboard
        </button>
      </div>
    );
  }

  const kpis    = dashboard.kpis || {};
  const recent  = dashboard.recentActivities || [];
  const appts   = dashboard.todayAppointments || [];

  // Build ordered kpi cards
  const kpiCards = Object.entries(kpis).map(([key, value]) => ({
    key,
    value,
    ...(KPI_META[key] || { icon: '📌', label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), color: ACCENT, path: null }),
  }));

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)',
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(37,99,235,0.25)',
        color: '#fff',
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🐾 VetOps Command Center</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
            Veterinary operations, clinical workflows & analytics — all in one place.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Today</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
        marginBottom: 28,
      }}>
        {kpiCards.map(({ key, value, icon, label, color, path }) => (
          <StatCard key={key} icon={icon} label={label} value={value} color={color} onClick={path ? () => navigate(path) : undefined} />
        ))}
      </div>

      {/* Two-column section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Recent Activities */}
        <SectionCard title="Recent Activities" icon="🕒">
          {recent.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No recent activities.</div>
          ) : (
            recent.slice(0, 8).map((a) => (
              <ListRow
                key={a.id}
                primary={a.action}
                secondary={new Date(a.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                badge="Activity"
                badgeColor="#8b5cf6"
              />
            ))
          )}
        </SectionCard>

        {/* Today's Appointments */}
        <SectionCard title="Today's Appointments" icon="📅">
          {appts.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No appointments scheduled today.</div>
          ) : (
            appts.slice(0, 8).map((a) => (
              <ListRow
                key={a.id}
                primary={a.service_type || 'Appointment'}
                secondary={`${a.appointment_time || ''} ${a.notes ? '· ' + a.notes : ''}`}
                badge={a.appointment_time || null}
                badgeColor="#0ea5e9"
              />
            ))
          )}
        </SectionCard>
      </div>

      {/* Quick access row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { icon: '⚙️', label: 'Workflow Queues', path: '/workflow-queues', color: '#6366f1' },
          { icon: '📊', label: 'Analytics',        path: '/analytics',       color: '#10b981' },
          { icon: '🛡️', label: 'Risk Analysis',    path: '/risk-analysis',   color: '#f59e0b' },
          { icon: '🤖', label: 'AI Insights',      path: '/ai',              color: '#8b5cf6' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              padding: '18px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}25`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{item.icon}</div>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: '#1e293b' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
