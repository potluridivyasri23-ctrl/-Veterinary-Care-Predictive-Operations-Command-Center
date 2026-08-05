import { useEffect, useState } from 'react';
import api from '../services/api';

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal State
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState({
    service_type: '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '09:00',
    priority: 'normal',
    notes: '',
  });

  const fetchAppointments = () => {
    setLoading(true);
    api.get('/appointments')
      .then((res) => setAppointments(res.data.data || res.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', form);
      setShowModal(false);
      setForm({ service_type: '', appointment_date: new Date().toISOString().split('T')[0], appointment_time: '09:00', priority: 'normal', notes: '' });
      fetchAppointments();
    } catch {
      alert('Failed to schedule appointment');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}`, { status });
      fetchAppointments();
    } catch {
      // fallback
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch = (a.service_type || '').toLowerCase().includes(search.toLowerCase()) ||
                          (a.notes || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || a.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const scheduledCount = appointments.filter(a => a.status === 'scheduled').length;
  const highPriority   = appointments.filter(a => a.priority === 'high' || a.priority === 'critical').length;
  const followUps      = appointments.filter(a => a.follow_up_required).length;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>📅 Appointments Management</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Schedule, filter, and track all patient clinical consultations.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 20px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          ➕ Schedule Appointment
        </button>
      </div>

      {/* KPI Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Appointments', value: appointments.length, icon: '🗓️', color: '#2563eb' },
          { label: 'Scheduled',          value: scheduledCount,     icon: '⏳', color: '#0ea5e9' },
          { label: 'High / Critical',    value: highPriority,       icon: '🔥', color: '#ef4444' },
          { label: 'Follow-ups Needed',  value: followUps,          icon: '🔁', color: '#f59e0b' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#ffffff', borderRadius: 14, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search Toolbar */}
      <div style={{ background: '#ffffff', borderRadius: 16, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Search service type, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13.5, background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13.5, background: '#f8fafc', outline: 'none', color: '#334155' }}
        >
          <option value="all">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13.5, background: '#f8fafc', outline: 'none', color: '#334155' }}
        >
          <option value="all">All Priorities</option>
          <option value="normal">Normal Priority</option>
          <option value="high">High Priority</option>
          <option value="critical">Critical Priority</option>
        </select>
      </div>

      {/* Table Container */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(37,99,235,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <th style={{ padding: '14px 20px' }}>Date & Time</th>
              <th style={{ padding: '14px 20px' }}>Service Type</th>
              <th style={{ padding: '14px 20px' }}>Priority</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
              <th style={{ padding: '14px 20px' }}>Notes</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading appointments…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No appointments match your filters.</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0f172a' }}>
                    <div>{new Date(item.appointment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{item.appointment_time || '09:00'}</div>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1d4ed8' }}>{item.service_type || 'Consultation'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: item.priority === 'critical' ? '#fef2f2' : item.priority === 'high' ? '#fff7ed' : '#eff6ff',
                      color: item.priority === 'critical' ? '#dc2626' : item.priority === 'high' ? '#ea580c' : '#2563eb',
                      padding: '3px 10px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'capitalize',
                    }}>
                      {item.priority || 'normal'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: item.status === 'completed' ? '#ecfdf5' : item.status === 'cancelled' ? '#fef2f2' : '#f0f9ff',
                      color: item.status === 'completed' ? '#059669' : item.status === 'cancelled' ? '#dc2626' : '#0284c7',
                      padding: '3px 10px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'capitalize',
                    }}>
                      {item.status || 'scheduled'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748b', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.notes || '—'}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {item.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'completed')}
                        style={{ background: '#ecfdf5', color: '#059669', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginRight: 6 }}
                      >
                        ✓ Complete
                      </button>
                    )}
                    {item.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'cancelled')}
                        style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        ✕ Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: 20, width: '100%', maxWidth: 480, padding: '32px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>📅 Schedule New Appointment</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Service Type</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wellness Check, Vaccination, X-Ray"
                  value={form.service_type}
                  onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Date</label>
                  <input
                    type="date"
                    required
                    value={form.appointment_date}
                    onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Time</label>
                  <input
                    type="time"
                    required
                    value={form.appointment_time}
                    onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Priority Level</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Notes & Clinical Detail</label>
                <textarea
                  rows={3}
                  placeholder="Additional patient notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#475569' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
