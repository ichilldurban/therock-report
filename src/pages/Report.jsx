import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StatCards from '../components/StatCards'
import ZoneChart from '../components/ZoneChart'
import ComparisonChart from '../components/ComparisonChart'
import AttendanceTable from '../components/AttendanceTable'
import ServingTeams from '../components/ServingTeams'
import PhotoGallery from '../components/PhotoGallery'
import ShareButton from '../components/ShareButton'
import { fetchAllSundays } from '../lib/data'
import { formatDate } from '../lib/helpers'
import { COLORS } from '../lib/constants'

export default function Report() {
  const { date } = useParams()
  const navigate = useNavigate()
  const [sundays, setSundays] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllSundays().then(data => {
      setSundays(data)
      setLoading(false)

      // If no date param, redirect to latest
      if (!date && data.length > 0) {
        navigate(`/report/${data[data.length - 1].date}`, { replace: true })
      }
    })
  }, [date, navigate])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: COLORS.muted }}>
        Loading...
      </div>
    )
  }

  const currentIdx = sundays.findIndex(s => s.date === date)
  const sunday = sundays[currentIdx]
  const prevSunday = currentIdx > 0 ? sundays[currentIdx - 1] : null

  if (!sunday) {
    return (
      <>
        <Header />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
          <h2 style={{ color: COLORS.primary, marginBottom: 12 }}>No Report Found</h2>
          <p style={{ color: COLORS.muted }}>
            {sundays.length > 0
              ? 'Select a Sunday from the tabs below.'
              : 'No reports have been entered yet.'}
          </p>
          {sundays.length > 0 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
              {sundays.map(s => (
                <button key={s.date} onClick={() => navigate(`/report/${s.date}`)} style={{
                  padding: '10px 22px', borderRadius: 24, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  background: 'white', color: COLORS.text,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  {formatDate(s.date)}
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <Header subtitle={formatDate(sunday.date)} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 16px 60px' }}>
        {/* Week tabs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          {sundays.map(s => (
            <button
              key={s.date}
              onClick={() => navigate(`/report/${s.date}`)}
              style={{
                padding: '10px 22px',
                borderRadius: 24,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                background: s.date === date ? COLORS.primary : 'white',
                color: s.date === date ? 'white' : COLORS.text,
                boxShadow: s.date === date
                  ? '0 4px 14px rgba(26,58,92,0.3)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.25s',
              }}
            >
              {formatDate(s.date)}
            </button>
          ))}
        </div>

        {/* Share button */}
        <ShareButton sunday={sunday} />

        {/* Stat cards */}
        <StatCards
          services={sunday.services}
          prevServices={prevSunday?.services}
        />

        {/* Zone breakdown */}
        <ZoneChart services={sunday.services} />

        {/* Week-on-week comparison */}
        <ComparisonChart
          currentServices={sunday.services}
          prevServices={prevSunday?.services}
          currentDate={formatDate(sunday.date)}
          prevDate={prevSunday ? formatDate(prevSunday.date) : null}
        />

        {/* Full detail table */}
        <AttendanceTable services={sunday.services} />

        {/* Serving teams */}
        <ServingTeams teams={sunday.teams} />

        {/* Photos */}
        <PhotoGallery photos={sunday.photos} />

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px 0', color: COLORS.muted, fontSize: 11 }}>
          Counted from balcony during sermon · Kids in service, congregation seated
          <br />
          The Rock Church — Weekly Attendance Report 2026
        </div>
      </div>
    </>
  )
}
