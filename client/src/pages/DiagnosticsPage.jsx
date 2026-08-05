import { useEffect, useState } from 'react';
import api from '../services/api';

function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState({
    tests_ordered: '',
    findings: '',
    result_summary: '',
    status: 'pending',
  });

  const fetchDiagnostics = () => {
    setLoading(true);
    api.get('/diagnostics')
      .then((res) => setDiagnostics(res.data.data || res.data || []))
      .catch(() => setDiagnostics([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      await api.post('/diagnostics', form);
      setShowModal(false);
      setForm({ tests_ordered: '', findings: '', result_summary: '', status: 'pending' });
      fetchDiagnostics();
    } catch {
      alert('Failed to order diagnostic test');
    }
  };

  const filtered = diagnostics.filter((d) => {
    return (d.tests_ordered || '').toLowerCase().includes(search.toLowerCase()) ||
           (d.findings || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>🔬 Lab & Imaging Diagnostics</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Order diagnostic imaging, review lab findings, and monitor test completion status.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 20px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(2,132,199,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          ➕ Order Diagnostic Test
        </button>
      </div>

      {/* Search */}
      <div style={{ background: '#ffffff', borderRadius: 16, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍 Search ordered tests, lab findings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13.5, background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading diagnostics…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 16 }}>No diagnostic records found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {filtered.map((item) => (
            <div key={item.id} style={{ background: '#ffffff', borderRadius: 18, padding: 22, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#0369a1' }}>
                  🧪 {item.tests_ordered || 'Diagnostic Panel'}
                </span>
                <span style={{
                  background: item.status === 'completed' ? '#ecfdf5' : '#fff7ed',
                  color: item.status === 'completed' ? '#059669' : '#ea580c',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 9px',
                  textTransform: 'capitalize',
                }}>
                  {item.status || 'pending'}
                </span>
              </div>

              <div style={{ fontSize: 13, color: '#334155', marginBottom: 10 }}>
                <strong>Clinical Findings:</strong>
                <div style={{ color: '#475569', marginTop: 2 }}>{item.findings || 'Pending lab processing.'}</div>
              </div>

              {item.result_summary && (
                <div style={{ fontSize: 12.5, color: '#0284c7', background: '#e0f2fe', borderRadius: 10, padding: '8px 12px', marginTop: 10 }}>
                  <strong>Result Summary:</strong> {item.result_summary}
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
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>🔬 Order Diagnostic Test</h3>
            <form onSubmit={handleOrder}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tests Ordered</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chest X-Ray, Full Blood Panel, Ultrasound"
                  value={form.tests_ordered}
                  onChange={(e) => setForm({ ...form, tests_ordered: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Initial Findings</label>
                <textarea
                  rows={3}
                  placeholder="Observed symptoms or preliminary scan notes..."
                  value={form.findings}
                  onChange={(e) => setForm({ ...form, findings: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Result Summary</label>
                <input
                  type="text"
                  placeholder="Confirmed diagnosis or lab summary..."
                  value={form.result_summary}
                  onChange={(e) => setForm({ ...form, result_summary: e.target.value })}
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
                  style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiagnosticsPage;
