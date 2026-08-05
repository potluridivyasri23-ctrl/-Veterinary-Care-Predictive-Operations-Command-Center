import { useEffect, useState } from 'react';
import api from '../services/api';

const SPECIES_ICONS = {
  Dog: '🐶',
  Cat: '🐱',
  Rabbit: '🐰',
  Cattle: '🐮',
  Horse: '🐴',
  Bird: '🦜',
};

function AnimalsPage() {
  const [animals, setAnimals]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: 1,
    sex: 'Male',
    medical_history: '',
  });

  const fetchAnimals = () => {
    setLoading(true);
    api.get('/animals')
      .then((res) => setAnimals(res.data.data || res.data || []))
      .catch(() => setAnimals([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/animals', form);
      setShowModal(false);
      setForm({ name: '', species: 'Dog', breed: '', age: 1, sex: 'Male', medical_history: '' });
      fetchAnimals();
    } catch {
      alert('Failed to register animal patient');
    }
  };

  const filtered = animals.filter((a) => {
    const matchesSearch = (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (a.breed || '').toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = speciesFilter === 'all' || a.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>🐾 Animal Patients Directory</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Register and monitor active veterinary patient profiles and medical histories.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
          ➕ Register New Patient
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ background: '#ffffff', borderRadius: 16, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Search patient name, breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13.5, background: '#f8fafc', outline: 'none' }}
        />
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13.5, background: '#f8fafc', outline: 'none', color: '#334155' }}
        >
          <option value="all">All Species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Rabbit">Rabbit</option>
          <option value="Cattle">Cattle</option>
          <option value="Bird">Bird</option>
        </select>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading animal patients…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 16 }}>No animal patients found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {filtered.map((a) => (
            <div key={a.id} style={{ background: '#ffffff', borderRadius: 18, padding: 22, border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                  {SPECIES_ICONS[a.species] || '🐾'}
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{a.name}</h3>
                  <span style={{ fontSize: 12, color: '#059669', fontWeight: 600, background: '#ecfdf5', borderRadius: 6, padding: '2px 8px' }}>
                    {a.species} • {a.breed || 'Mixed'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12.5, color: '#475569', marginBottom: 14, background: '#f8fafc', borderRadius: 10, padding: '10px 12px' }}>
                <div><strong>Age:</strong> {a.age ? `${a.age} yrs` : 'N/A'}</div>
                <div><strong>Sex:</strong> {a.sex || 'Unknown'}</div>
              </div>

              <div style={{ fontSize: 12, color: '#64748b' }}>
                <strong>Medical History:</strong>
                <div style={{ color: '#334155', marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {a.medical_history || 'No recorded history.'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: 20, width: '100%', maxWidth: 480, padding: '32px 36px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>🐾 Register New Patient</h3>
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buddy, Luna, Max"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Species</label>
                  <select
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                  >
                    <option value="Dog">Dog 🐶</option>
                    <option value="Cat">Cat 🐱</option>
                    <option value="Rabbit">Rabbit 🐰</option>
                    <option value="Cattle">Cattle 🐮</option>
                    <option value="Bird">Bird 🦜</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Breed</label>
                  <input
                    type="text"
                    placeholder="e.g. Labrador, Siamese"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Age (years)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Sex</label>
                  <select
                    value={form.sex}
                    onChange={(e) => setForm({ ...form, sex: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 14, boxSizing: 'border-box' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Medical History & Allergies</label>
                <textarea
                  rows={3}
                  placeholder="Known allergies, vaccinations, pre-existing conditions..."
                  value={form.medical_history}
                  onChange={(e) => setForm({ ...form, medical_history: e.target.value })}
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
                  style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimalsPage;
