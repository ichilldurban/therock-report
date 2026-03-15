import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Header({ title = 'Sunday Service Report', subtitle }) {
  const { user } = useAuth()

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1a3a5c, #2a5a8c)',
      color: 'white',
      textAlign: 'center',
      padding: '48px 24px 36px',
      borderRadius: '0 0 36px 36px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'rgba(232,145,58,0.12)' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.65, marginBottom: 6 }}>
          The Rock Church
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, marginBottom: 6 }}>
          {title}
        </h1>
        {subtitle && (
          <div style={{ fontSize: 20, opacity: 0.9, fontStyle: 'italic' }}>{subtitle}</div>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        <NavLink to="/">Report</NavLink>
        <NavLink to="/history">History</NavLink>
        {user ? (
          <NavLink to="/admin/dashboard">Admin</NavLink>
        ) : (
          <NavLink to="/admin">Login</NavLink>
        )}
      </nav>
    </header>
  )
}

function NavLink({ to, children }) {
  return (
    <Link to={to} style={{
      padding: '6px 18px',
      borderRadius: 20,
      background: 'rgba(255,255,255,0.15)',
      color: 'white',
      textDecoration: 'none',
      fontSize: 13,
      fontWeight: 600,
      transition: 'background 0.2s',
    }}
    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
    >
      {children}
    </Link>
  )
}
