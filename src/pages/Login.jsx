import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'
import { COLORS } from '../lib/constants'
import { isDemo } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header title="Admin Login" />
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{
          background: 'white',
          borderRadius: 18,
          padding: 32,
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: 24, color: COLORS.primary, marginBottom: 8, textAlign: 'center' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: 13, color: COLORS.muted, textAlign: 'center', marginBottom: 24 }}>
            Sign in to manage Sunday reports
          </p>

          {isDemo && (
            <div style={{
              background: '#FEF3C7',
              border: '1px solid #F59E0B',
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 12,
              color: '#92400E',
              marginBottom: 20,
            }}>
              <strong>Demo Mode</strong> — Enter any email/password to log in.
              Connect Supabase for persistent data.
            </div>
          )}

          {error && (
            <div style={{
              background: '#FEE2E2',
              border: `1px solid ${COLORS.rose}`,
              borderRadius: 10,
              padding: '12px 16px',
              fontSize: 12,
              color: '#991B1B',
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@therock.church"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = COLORS.accent}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 10,
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = COLORS.accent}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              background: COLORS.primary,
              color: 'white',
              boxShadow: '0 4px 14px rgba(26,58,92,0.3)',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: COLORS.muted }}>
            Need an account?{' '}
            <Link to="/admin/register" style={{ color: COLORS.accent, fontWeight: 600, textDecoration: 'none' }}>
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
