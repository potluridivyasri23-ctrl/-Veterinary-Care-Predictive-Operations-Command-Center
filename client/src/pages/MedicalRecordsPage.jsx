import { useEffect, useState } from 'react';
import api from '../services/api';

function MedicalRecordsPage() {
  const [records, setRecords]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState({
    animal_id: 1,
    record_type: 'Checkup',
    notes: '',
  });

  const fetchRecords = () => {
    setLoading(true);
    api.get('/medical-records')
      .then((res) => setRecords(res.data.data || res.data || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/medical-records', form);
      setShowModal(false);
      setForm({ animal_id: 1, record_type: 'Checkup', notes: '' });
      fetchRecords();
    } catch {
      alert('Failed to add medical record');
    }
  };

  const filtered = records.filter((r) => {
    return (r.record_type || '').toLowerCase().includes(search.toLowerCase()) ||
           (r.notes || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>📋 Patient Medical Records</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Comprehensive clinical history, allergy logs, and surgical care notes.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
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
          ➕ Add Medical Record
        </button>
      </div>

      {/* Search */}
      <div style={{ background: '#ffffff', borderRadius: 16, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Search medical record type or clinical notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13.5, background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Records Cards Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading medical records…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 16 }}>No medical records found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {filtered.map((r) => (
            <div key={r.id} style={{ background: '#ffffff', borderRadius: 18, padding: 22, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, fontSize: 12, padding: '3px 10px', borderRadius: 8 }}>
                  📌 {r.record_type || 'General Record'}
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}
                </span>
              </div>
              <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, marginBottom: 14 }}>
                {r.notes || 'No detailed clinical notes provided.'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span>Patient ID: <strong>#{r.animal_id || 1}</strong></span>
                <span>Logged by Staff</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: 20, width: '100%', maxWidth: 480, padding: '32px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>📋 Add Medical Record</h3>
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Record Category</label>
                <select
                  value={form.record_type}
                  onChange={(e) => setForm({ ...form, record_type: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                >
                  <option value="Checkup">General Checkup</option>
                  <option value="Allergy">Allergy Alert</option>
                  <option value="Vaccination">Vaccination Record</option>
                  <option value="Post-surgery care">Post-surgery Care</option>
                  <option value="Chronic Condition">Chronic Condition</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Clinical Observations & Notes</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record symptoms, diagnosis findings, prescribed care instructions..."
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalRecordsPage;
