import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import { COLORS } from '../lib/constants'
import { isDemo } from '../lib/supabase'
import { signUp } from '../lib/data'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, name)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Header title="Registration Submitted" />
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 16px' }}>
          <div style={{
            background: 'white',
            borderRadius: 18,
            padding: 32,
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <h2 style={{ fontSize: 22, color: COLORS.primary, marginBottom: 12 }}>
              Request Submitted
            </h2>
            <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.6, marginBottom: 24 }}>
              Your registration request has been sent. An administrator will review and approve your account. You'll receive an email once approved.
            </p>
            <button onClick={() => navigate('/admin')} style={{
              padding: '12px 32px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              background: COLORS.primary,
              color: 'white',
            }}>
              Back to Login
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Register" />
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{
          background: 'white',
          borderRadius: 18,
          padding: 32,
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: 24, color: COLORS.primary, marginBottom: 8, textAlign: 'center' }}>
            Create Account
          </h2>
          <p style={{ fontSize: 13, color: COLORS.muted, textAlign: 'center', marginBottom: 24 }}>
            Request access to manage Sunday reports
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
              <strong>Demo Mode</strong> — Registration is simulated. Connect Supabase for real accounts.
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
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Stefan Coetzee"
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@therock.church"
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
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
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
              background: COLORS.accent,
              color: 'white',
              boxShadow: '0 4px 14px rgba(232,145,58,0.3)',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Submitting...' : 'Request Access'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: COLORS.muted }}>
            Already have an account?{' '}
            <Link to="/admin" style={{ color: COLORS.primary, fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
