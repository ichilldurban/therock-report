import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { COLORS } from '../lib/constants'

// The Rock Church chevron logo as inline SVG
function RockLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="30,8 30,20" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="20,18 30,28 40,18" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="20,28 30,38 40,28" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="20,38 30,48 40,38" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export default function Header({ title = 'Sunday Service Report', subtitle }) {
  const { user } = useAuth()

  return (
    <header style={{
      background: '#FFFFFF',
      color: COLORS.text,
      textAlign: 'center',
      padding: '36px 24px 28px',
      borderBottom: `1px solid ${COLORS.border}`,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <RockLogo size={44} />
        <div style={{
          fontSize: 11,
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontWeight: 700,
          color: COLORS.text,
        }}>
          The Rock Church
        </div>
        <div style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 16,
          color: COLORS.muted,
          marginTop: -4,
        }}>
          Set free to love
        </div>
      </div>

      <h1 style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 26,
        fontWeight: 700,
        color: COLORS.text,
        marginTop: 16,
        marginBottom: 4,
      }}>
        {title}
      </h1>
      {subtitle && (
        <div style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 22,
          color: COLORS.muted,
        }}>
          {subtitle}
        </div>
      )}

      {/* Nav links */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        marginTop: 18,
        flexWrap: 'wrap',
      }}>
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
      padding: '8px 20px',
      borderRadius: 8,
      background: COLORS.primary,
      color: 'white',
      textDecoration: 'none',
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      transition: 'opacity 0.2s',
    }}
    onMouseEnter={e => e.target.style.opacity = '0.85'}
    onMouseLeave={e => e.target.style.opacity = '1'}
    >
      {children}
    </Link>
  )
}
