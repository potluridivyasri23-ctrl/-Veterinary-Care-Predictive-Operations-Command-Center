import { useEffect, useState } from 'react';
import api from '../services/api';

function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState({
    animal_id: 1,
    vaccine_name: 'Rabies Booster',
    dose: '1ml SC',
    scheduled_date: new Date().toISOString().split('T')[0],
    status: 'scheduled',
  });

  const fetchVaccinations = () => {
    setLoading(true);
    api.get('/vaccinations')
      .then((res) => setVaccinations(res.data.data || res.data || []))
      .catch(() => setVaccinations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const handleRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vaccinations', form);
      setShowModal(false);
      setForm({ animal_id: 1, vaccine_name: 'Rabies Booster', dose: '1ml SC', scheduled_date: new Date().toISOString().split('T')[0], status: 'scheduled' });
      fetchVaccinations();
    } catch {
      alert('Failed to record vaccination');
    }
  };

  const filtered = vaccinations.filter((v) => {
    return (v.vaccine_name || '').toLowerCase().includes(search.toLowerCase()) ||
           (v.dose || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>💉 Immunization & Vaccination Tracker</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Schedule rabies boosters, FVRCP vaccines, and track patient immunization compliance.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 20px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          ➕ Record Vaccination
        </button>
      </div>

      {/* Search */}
      <div style={{ background: '#ffffff', borderRadius: 16, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Search vaccine name (e.g. Rabies, FVRCP, DHPP)..."
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
              <th style={{ padding: '14px 20px' }}>Patient ID</th>
              <th style={{ padding: '14px 20px' }}>Vaccine Name</th>
              <th style={{ padding: '14px 20px' }}>Dose</th>
              <th style={{ padding: '14px 20px' }}>Scheduled Date</th>
              <th style={{ padding: '14px 20px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading vaccinations…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No vaccination records found.</td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>Patient #{v.animal_id || 1}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#059669' }}>💉 {v.vaccine_name || 'Vaccine'}</td>
                  <td style={{ padding: '14px 20px', color: '#334155' }}>{v.dose || '1 Dose'}</td>
                  <td style={{ padding: '14px 20px', color: '#64748b' }}>{v.scheduled_date ? new Date(v.scheduled_date).toLocaleDateString() : 'Today'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: v.status === 'completed' ? '#ecfdf5' : '#eff6ff',
                      color: v.status === 'completed' ? '#059669' : '#2563eb',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 10px',
                      textTransform: 'capitalize',
                    }}>
                      {v.status || 'scheduled'}
                    </span>
                  </td>
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
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>💉 Record Vaccination</h3>
            <form onSubmit={handleRecord}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Vaccine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rabies 3-Year, DHPP, FVRCP Booster"
                  value={form.vaccine_name}
                  onChange={(e) => setForm({ ...form, vaccine_name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Dose</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1ml Subcutaneous"
                    value={form.dose}
                    onChange={(e) => setForm({ ...form, dose: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={form.scheduled_date}
                    onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#475569' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >
                  Save Vaccination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VaccinationsPage;
