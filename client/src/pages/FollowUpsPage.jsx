import { useEffect, useState } from 'react';
import api from '../services/api';

function FollowUpsPage() {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({
    appointment_id: 1,
    scheduled_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchFollowUps = () => {
    setLoading(true);
    api.get('/follow-ups')
      .then((res) => setFollowups(res.data.data || res.data || []))
      .catch(() => setFollowups([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/follow-ups', form);
      setShowModal(false);
      setForm({ appointment_id: 1, scheduled_date: new Date().toISOString().split('T')[0], notes: '' });
      fetchFollowUps();
    } catch {
      alert('Failed to schedule follow-up');
    }
  };

  const filtered = followups.filter((f) => {
    return (f.notes || '').toLowerCase().includes(search.toLowerCase()) ||
           (f.service_type || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>🔁 Patient Follow-up Tracker</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Schedule and track mandatory clinical follow-up consultations and post-op care checks.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 20px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          ➕ Schedule Follow-Up
        </button>
      </div>

      {/* Search */}
      <div style={{ background: '#ffffff', borderRadius: 16, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Search follow-up notes, patient ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13.5, background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(37,99,235,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              <th style={{ padding: '14px 20px' }}>Appt ID</th>
              <th style={{ padding: '14px 20px' }}>Patient & Owner</th>
              <th style={{ padding: '14px 20px' }}>Scheduled Date</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
              <th style={{ padding: '14px 20px' }}>Follow-up Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading follow-ups…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No follow-up records found.</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#d97706' }}>Appt #{item.appointment_id || 1}</td>
                  <td style={{ padding: '14px 20px', color: '#334155' }}>Patient #{item.animal_id || 1} (Owner #{item.owner_id || 1})</td>
                  <td style={{ padding: '14px 20px', color: '#0f172a', fontWeight: 600 }}>
                    📅 {item.scheduled_date ? new Date(item.scheduled_date).toLocaleDateString() : 'Upcoming'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: item.status === 'completed' ? '#ecfdf5' : '#fffbeb',
                      color: item.status === 'completed' ? '#059669' : '#b45309',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 10px',
                      textTransform: 'capitalize',
                    }}>
                      {item.status || 'scheduled'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#64748b' }}>{item.notes || 'Routine checkup required.'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: 20, width: '100%', maxWidth: 480, padding: '32px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>🔁 Schedule Follow-Up</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Target Appointment ID</label>
                <input
                  type="number"
                  required
                  value={form.appointment_id}
                  onChange={(e) => setForm({ ...form, appointment_id: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Follow-Up Date</label>
                <input
                  type="date"
                  required
                  value={form.scheduled_date}
                  onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Follow-Up Clinical Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Check respiratory symptoms, review blood test progress..."
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
                  style={{ background: '#d97706', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >
                  Schedule Follow-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowUpsPage;
