import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Header from '../components/Header'
import { fetchAllSundays } from '../lib/data'
import { formatDate, totalOf } from '../lib/helpers'
import { COLORS } from '../lib/constants'

export default function History() {
  const [sundays, setSundays] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllSundays().then(data => {
      setSundays(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: COLORS.muted }}>
        Loading...
      </div>
    )
  }

  const chartData = sundays.map(s => ({
    date: formatDate(s.date),
    '8am': totalOf(s.services[0]),
    '10am': totalOf(s.services[1]),
    'Combined': totalOf(s.services[0]) + totalOf(s.services[1]),
  }))

  return (
    <>
      <Header title="Attendance History" />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 16px 60px' }}>
        {/* Trend chart */}
        {sundays.length > 1 && (
          <div style={{
            background: 'white',
            borderRadius: 18,
            padding: 24,
            marginBottom: 28,
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          }}>
            <h2 style={{ fontSize: 20, color: COLORS.primary, marginBottom: 18 }}>
              Attendance Trends
            </h2>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="8am" stroke={COLORS.blue} strokeWidth={2} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="10am" stroke={COLORS.accent} strokeWidth={2} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Combined" stroke={COLORS.green} strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Weekly cards */}
        <h2 style={{ fontSize: 22, color: COLORS.primary, textAlign: 'center', marginBottom: 18 }}>
          All Sundays
        </h2>

        {sundays.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: COLORS.muted }}>
            No reports yet. Add your first Sunday via the Admin panel.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...sundays].reverse().map((s, i) => {
              const total8 = totalOf(s.services[0])
              const total10 = totalOf(s.services[1])
              const combined = total8 + total10

              // Find previous week for diff
              const realIdx = sundays.length - 1 - i
              const prev = realIdx > 0 ? sundays[realIdx - 1] : null
              const prevCombined = prev ? totalOf(prev.services[0]) + totalOf(prev.services[1]) : null
              const diff = prevCombined !== null ? combined - prevCombined : null

              return (
                <div
                  key={s.date}
                  onClick={() => navigate(`/report/${s.date}`)}
                  style={{
                    background: 'white',
                    borderRadius: 16,
                    padding: '20px 24px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
                >
                  <div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: COLORS.primary, marginBottom: 4 }}>
                      {formatDate(s.date)}
                      {s.is_special && <span style={{ marginLeft: 8, fontSize: 12, color: COLORS.gold }}>⭐ Special</span>}
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.muted }}>
                      8am: <strong style={{ color: COLORS.blue }}>{total8}</strong>
                      {' · '}
                      10am: <strong style={{ color: COLORS.accent }}>{total10}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: COLORS.green,
                      letterSpacing: -1,
                    }}>
                      {combined}
                    </div>
                    {diff !== null && (
                      <div style={{ fontSize: 11, color: diff >= 0 ? COLORS.green : COLORS.rose, fontWeight: 600 }}>
                        {diff >= 0 ? '↑' : '↓'} {Math.abs(diff)}
                      </div>
                    )}
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
