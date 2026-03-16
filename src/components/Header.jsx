import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { COLORS } from '../lib/constants'

// The Rock Church chevron logo - matching their dark/green website aesthetic
function RockLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="30,8 30,20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="20,18 30,28 40,18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="20,28 30,38 40,28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="20,38 30,48 40,38" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export default function Header({ title = 'Sunday Service Report', subtitle }) {
  const { user } = useAuth()

  return (
    <header style={{
      background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.primary} 100%)`,
      color: 'white',
      textAlign: 'center',
      padding: '36px 24px 28px',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <RockLogo size={44} />
        <div style={{
          fontSize: 11,
          letterSpacing: 4,
          textTransform: 'uppercase',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.9)',
        }}>
          The Rock Church
        </div>
        <div style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 16,
          color: COLORS.sage,
          marginTop: -2,
        }}>
          Set free to love
        </div>
      </div>

      <h1 style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 24,
        fontWeight: 300,
        color: 'white',
        marginTop: 16,
        marginBottom: 4,
        letterSpacing: 0.5,
      }}>
        {title}
      </h1>
      {subtitle && (
        <div style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 22,
          color: COLORS.sage,
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
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(4px)',
      color: 'white',
      textDecoration: 'none',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: "'Inter', sans-serif",
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      transition: 'background 0.2s',
      border: '1px solid rgba(255,255,255,0.2)',
    }}
    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
    >
      {children}
    </Link>
  )
}
