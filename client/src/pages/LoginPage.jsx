import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password, rememberMe });
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('🌐 Connection failed: Cannot reach backend server. Please configure your Render backend URL in Netlify environment variables (VITE_API_URL) or netlify.toml.');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('VetPass123');
    setError('');
  };

  const field = {
    width: '100%',
    padding: '13px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 12,
    fontSize: 14,
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const demoAccounts = [
    { label: 'Ops Admin', email: 'opsadmin@vetcenter.com' },
    { label: 'Veterinarian', email: 'vet@vetcenter.com' },
    { label: 'Manager', email: 'manager@vetcenter.com' },
    { label: 'Reception', email: 'reception@vetcenter.com' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)',
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 55%, #2563eb 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        color: '#fff',
        minWidth: 340,
      }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🐾</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 12px', textAlign: 'center', letterSpacing: '-0.5px' }}>
          VetOps Command Center
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, textAlign: 'center', lineHeight: 1.7, maxWidth: 320 }}>
          Unified veterinary operations platform — manage patients, workflows, analytics, and clinical records in one place.
        </p>

        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 18, width: '100%', maxWidth: 300 }}>
          {[
            { icon: '📅', text: 'Smart appointment scheduling' },
            { icon: '🔬', text: 'Diagnostics & medical records' },
            { icon: '📊', text: 'Real-time analytics & forecasts' },
            { icon: '🤖', text: 'AI-powered clinical insights' },
          ].map((f) => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
              <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.85)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        minWidth: 360,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(37,99,235,0.14)',
          padding: '44px 40px',
          border: '1px solid rgba(148,163,184,0.16)',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Welcome back</h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Sign in to your VetOps account</p>
          </div>

          {/* Quick Preset Selector */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              ⚡ Quick Fill Demo Accounts
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email)}
                  style={{
                    background: email === acc.email ? '#2563eb' : '#ffffff',
                    color: email === acc.email ? '#ffffff' : '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 20, color: '#dc2626', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@vetops.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={field}
                onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...field, paddingRight: 44 }}
                  onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94a3b8' }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: 13, color: '#475569', cursor: 'pointer' }}>Keep me signed in</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 0',
                background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s, transform 0.15s',
                boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.92'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {loading ? '⏳ Signing in…' : '→ Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94a3b8' }}>
            Forgot your password? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
