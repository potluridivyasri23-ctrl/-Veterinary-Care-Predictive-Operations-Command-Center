import { useEffect, useState } from 'react';
import api from '../services/api';

function TreatmentsPage() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState({
    description: '',
    medications: '',
    status: 'in progress',
  });

  const fetchTreatments = () => {
    setLoading(true);
    api.get('/treatments')
      .then((res) => setTreatments(res.data.data || res.data || []))
      .catch(() => setTreatments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/treatments', form);
      setShowModal(false);
      setForm({ description: '', medications: '', status: 'in progress' });
      fetchTreatments();
    } catch {
      alert('Failed to log treatment plan');
    }
  };

  const filtered = treatments.filter((t) => {
    return (t.description || '').toLowerCase().includes(search.toLowerCase()) ||
           (t.medications || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>💊 Treatment Plans & Prescriptions</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Monitor active therapeutic treatments, medication dosages, and recovery status.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 20px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(6,182,212,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          ➕ Log New Treatment
        </button>
      </div>

      {/* Search */}
      <div style={{ background: '#ffffff', borderRadius: 16, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Search treatment description or prescribed medications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13.5, background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading treatments…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 16 }}>No treatment plans found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {filtered.map((item) => (
            <div key={item.id} style={{ background: '#ffffff', borderRadius: 18, padding: 22, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#0891b2' }}>
                  💊 {item.description || 'Treatment Protocol'}
                </span>
                <span style={{
                  background: item.status === 'completed' ? '#ecfdf5' : '#ecfeff',
                  color: item.status === 'completed' ? '#059669' : '#0891b2',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 9px',
                  textTransform: 'capitalize',
                }}>
                  {item.status || 'ongoing'}
                </span>
              </div>

              {item.medications && (
                <div style={{ fontSize: 13, background: '#f0fdfa', borderRadius: 10, padding: '10px 14px', border: '1px solid #ccfbf1', color: '#0f766e', marginTop: 10 }}>
                  <strong>Prescribed Medications:</strong>
                  <div style={{ marginTop: 2, fontWeight: 600 }}>{item.medications}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: 20, width: '100%', maxWidth: 480, padding: '32px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>💊 Log New Treatment</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Treatment Protocol Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Initiate weight management plan and joint supplements..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Prescribed Medications & Dosage</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amoxicillin 250mg, Glucosamine daily"
                  value={form.medications}
                  onChange={(e) => setForm({ ...form, medications: e.target.value })}
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
                  style={{ background: '#06b6d4', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TreatmentsPage;
