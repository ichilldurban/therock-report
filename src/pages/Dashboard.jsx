import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../hooks/useAuth'
import { fetchAllSundays, deleteSunday } from '../lib/data'
import { formatDate, totalOf } from '../lib/helpers'
import { COLORS } from '../lib/constants'

export default function Dashboard() {
  const [sundays, setSundays] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/admin'); return }
    fetchAllSundays().then(data => { setSundays(data); setLoading(false) })
  }, [user, authLoading, navigate])

  const handleDelete = async (date) => {
    if (!window.confirm(`Delete report for ${formatDate(date)}?`)) return
    await deleteSunday(date)
    setSundays(prev => prev.filter(s => s.date !== date))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin')
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: COLORS.muted }}>Loading...</div>
  }

  return (
    <>
      <Header title="Admin Dashboard" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 16px 60px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 13, color: COLORS.muted }}>
            Signed in as <strong>{user?.email}</strong>
          </div>
          <button onClick={handleLogout} style={{
            padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${COLORS.border}`,
            cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            background: 'white', color: COLORS.muted,
          }}>
            Sign Out
          </button>
        </div>

        {/* Add new button */}
        <button onClick={() => navigate('/admin/entry')} style={{
          width: '100%',
          padding: '16px',
          borderRadius: 14,
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          background: COLORS.accent,
          color: 'white',
          boxShadow: '0 4px 14px rgba(232,145,58,0.3)',
          marginBottom: 24,
        }}>
          + Add New Sunday
        </button>

        {/* Sundays list */}
        <h2 style={{ fontSize: 22, color: COLORS.primary, marginBottom: 16 }}>All Reports</h2>

        {sundays.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: COLORS.muted }}>
            No reports yet. Tap the button above to add your first Sunday!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...sundays].reverse().map(s => {
              const combined = totalOf(s.services[0]) + totalOf(s.services[1])
              return (
                <div key={s.date} style={{
                  background: 'white',
                  borderRadius: 14,
                  padding: '16px 20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: COLORS.primary }}>
                      {formatDate(s.date)}
                      {s.is_special && <span style={{ marginLeft: 8, fontSize: 11, color: COLORS.gold }}>⭐</span>}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
                      Combined: <strong style={{ color: COLORS.green }}>{combined}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => navigate(`/report/${s.date}`)} style={smallBtn(COLORS.blue)}>View</button>
                    <button onClick={() => navigate(`/admin/entry/${s.date}`)} style={smallBtn(COLORS.accent)}>Edit</button>
                    <button onClick={() => handleDelete(s.date)} style={smallBtn(COLORS.rose)}>🗑</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

function smallBtn(color) {
  return {
    padding: '6px 12px',
    borderRadius: 8,
    border: `1.5px solid ${color}`,
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    background: 'white',
    color,
  }
}
