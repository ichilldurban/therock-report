import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useAuth } from '../hooks/useAuth'
import { fetchSundayByDate, fetchAllSundays, saveSunday, uploadPhoto } from '../lib/data'
import { totalOf, todayStr } from '../lib/helpers'
import { COLORS, EMPTY_SERVICE, EMPTY_TEAMS, TEAM_SECTIONS, PHOTO_CATEGORIES } from '../lib/constants'

export default function Entry() {
  const { date: paramDate } = useParams()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [date, setDate] = useState(paramDate || todayStr())
  const [svc8, setSvc8] = useState({ ...EMPTY_SERVICE })
  const [svc10, setSvc10] = useState({ ...EMPTY_SERVICE })
  const [teams, setTeams] = useState(JSON.parse(JSON.stringify(EMPTY_TEAMS)))
  const [photos, setPhotos] = useState({ worship8: [], service8: [], worship10: [], service10: [] })
  const [notes, setNotes] = useState('')
  const [isSpecial, setIsSpecial] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(!!paramDate)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/admin'); return }
    if (paramDate) {
      fetchSundayByDate(paramDate).then(data => {
        if (data) {
          setDate(data.date)
          setSvc8(data.services[0])
          setSvc10(data.services[1])
          setTeams(data.teams || JSON.parse(JSON.stringify(EMPTY_TEAMS)))
          setPhotos(data.photos || { worship8: [], service8: [], worship10: [], service10: [] })
          setNotes(data.notes || '')
          setIsSpecial(data.is_special || false)
          setIsEdit(true)
        }
        setLoading(false)
      })
    }
  }, [paramDate, user, authLoading, navigate])

  const handleCopyLastWeek = async () => {
    const all = await fetchAllSundays()
    if (all.length > 0) {
      const last = all[all.length - 1]
      if (last.teams) {
        setTeams(JSON.parse(JSON.stringify(last.teams)))
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const entry = {
        date,
        notes,
        is_special: isSpecial,
        services: [
          { time_slot: '8am', ...svc8 },
          { time_slot: '10am', ...svc10 },
        ],
        teams,
        photos,
      }
      await saveSunday(entry)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        navigate('/admin/dashboard')
      }, 1500)
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: COLORS.muted }}>Loading...</div>
  }

  return (
    <>
      <Header title={isEdit ? 'Edit Sunday' : 'New Sunday'} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 16px 60px' }}>
        {/* Date + Notes */}
        <Card>
          <CardTitle>{isEdit ? 'Edit Report' : 'New Report'}</CardTitle>
          <Label>Date</Label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            disabled={isEdit}
            style={inputStyle}
          />
          <div style={{ marginTop: 12 }}>
            <Label>Notes (optional)</Label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Easter service, special event..." style={inputStyle} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={isSpecial} onChange={e => setIsSpecial(e.target.checked)} id="special" />
            <label htmlFor="special" style={{ fontSize: 13, color: COLORS.muted }}>Mark as special service (Easter, Christmas, etc.)</label>
          </div>
        </Card>

        {/* 8am Service */}
        <Card borderColor={COLORS.blue}>
          <CardTitle style={{ color: COLORS.blue }}>8:00 AM Service</CardTitle>
          <CountInputRow service={svc8} onChange={setSvc8} />
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 20, fontWeight: 800, color: COLORS.blue }}>
            Total: {totalOf(svc8)}
          </div>
          <div style={{ marginTop: 16 }}>
            <PhotoUploader label="Worship Photos" category="worship8" photos={photos} setPhotos={setPhotos} date={date} />
            <PhotoUploader label="Service Photos (seated count)" category="service8" photos={photos} setPhotos={setPhotos} date={date} />
          </div>
        </Card>

        {/* 10am Service */}
        <Card borderColor={COLORS.accent}>
          <CardTitle style={{ color: COLORS.accent }}>10:00 AM Service</CardTitle>
          <CountInputRow service={svc10} onChange={setSvc10} />
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 20, fontWeight: 800, color: COLORS.accent }}>
            Total: {totalOf(svc10)}
          </div>
          <div style={{ marginTop: 16 }}>
            <PhotoUploader label="Worship Photos" category="worship10" photos={photos} setPhotos={setPhotos} date={date} />
            <PhotoUploader label="Service Photos (seated count)" category="service10" photos={photos} setPhotos={setPhotos} date={date} />
          </div>
        </Card>

        {/* Serving Teams */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <CardTitle style={{ marginBottom: 0 }}>Serving Teams</CardTitle>
            <button onClick={handleCopyLastWeek} style={{
              padding: '6px 14px', borderRadius: 8, border: `1px solid ${COLORS.border}`,
              cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              background: COLORS.light, color: COLORS.muted,
            }}>
              📋 Copy Last Week
            </button>
          </div>

          {TEAM_SECTIONS.map(section => (
            <TeamInputGroup
              key={section.key}
              title={section.title}
              icon={section.icon}
              color={section.color}
              members={teams[section.key]}
              onChange={members => setTeams(t => ({ ...t, [section.key]: members }))}
            />
          ))}
        </Card>

        {/* Save */}
        <button onClick={handleSave} disabled={saving} style={{
          width: '100%',
          padding: '16px',
          borderRadius: 14,
          border: 'none',
          cursor: saving ? 'wait' : 'pointer',
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          background: saved ? COLORS.green : COLORS.primary,
          color: 'white',
          boxShadow: '0 4px 14px rgba(26,58,92,0.3)',
          transition: 'background 0.3s',
          opacity: saving ? 0.7 : 1,
        }}>
          {saved ? '✓ Saved!' : saving ? 'Saving...' : isEdit ? 'Update Sunday' : 'Save Sunday'}
        </button>

        <button onClick={() => navigate('/admin/dashboard')} style={{
          width: '100%',
          padding: '14px',
          borderRadius: 14,
          border: `1.5px solid ${COLORS.border}`,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          background: 'white',
          color: COLORS.muted,
          marginTop: 10,
        }}>
          Cancel
        </button>
      </div>
    </>
  )
}

// ─── Sub-components ───

function Card({ children, borderColor }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
      ...(borderColor ? { borderTop: `3px solid ${borderColor}` } : {}),
    }}>
      {children}
    </div>
  )
}

function CardTitle({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: "'DM Serif Display', serif",
      fontSize: 18,
      fontWeight: 700,
      color: COLORS.primary,
      marginBottom: 14,
      ...style,
    }}>
      {children}
    </div>
  )
}

function Label({ children }) {
  return (
    <label style={{
      fontSize: 12, fontWeight: 600, color: COLORS.muted,
      display: 'block', marginBottom: 6,
      textTransform: 'uppercase', letterSpacing: 0.5,
    }}>
      {children}
    </label>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: `1.5px solid ${COLORS.border}`,
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  background: 'white',
}

function CountInputRow({ service, onChange }) {
  const fields = [
    { key: 'left', label: 'Left' },
    { key: 'centre', label: 'Centre' },
    { key: 'right', label: 'Right' },
    { key: 'extras', label: 'Extras' },
    { key: 'mothers', label: 'Moms Rm' },
  ]

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {fields.map(f => (
        <div key={f.key} style={{ flex: '1 1 80px', minWidth: 70 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted, display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center' }}>
            {f.label}
          </label>
          <input
            type="number"
            value={service[f.key]}
            onChange={e => onChange({ ...service, [f.key]: e.target.value })}
            placeholder="0"
            style={{
              width: '100%',
              padding: '10px 6px',
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              textAlign: 'center',
              outline: 'none',
              background: 'white',
            }}
            onFocus={e => e.target.style.borderColor = COLORS.accent}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
        </div>
      ))}
    </div>
  )
}

function TeamInputGroup({ title, icon, color, members, onChange }) {
  const update = (i, val) => {
    const m = [...members]
    m[i] = { ...m[i], name: val }
    onChange(m)
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderLeft: `4px solid ${color}`,
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
        {icon} {title}
      </div>
      {members.map((m, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600, width: 100, flexShrink: 0 }}>
            {m.role}
          </span>
          <input
            value={m.name}
            onChange={e => update(i, e.target.value)}
            placeholder="Name(s)"
            style={{
              flex: 1,
              padding: '7px 10px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
        </div>
      ))}
    </div>
  )
}

function PhotoUploader({ label, category, photos, setPhotos, date }) {
  const fileRef = useRef()
  const images = photos[category] || []

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files)
    for (let i = 0; i < files.length; i++) {
      const url = await uploadPhoto(files[i], date, category, images.length + i)
      setPhotos(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), url],
      }))
    }
    e.target.value = ''
  }

  const remove = (idx) => {
    setPhotos(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== idx),
    }))
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {images.map((src, i) => (
          <div key={i} style={{ position: 'relative', width: 80, height: 60, borderRadius: 8, overflow: 'hidden' }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => remove(i)} style={{
              position: 'absolute', top: 2, right: 2,
              background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none',
              borderRadius: '50%', width: 18, height: 18, fontSize: 10,
              cursor: 'pointer', lineHeight: '18px', padding: 0,
            }}>✕</button>
          </div>
        ))}
        <button onClick={() => fileRef.current.click()} style={{
          width: 80, height: 60, borderRadius: 8,
          border: `2px dashed ${COLORS.border}`,
          background: COLORS.light, cursor: 'pointer',
          fontSize: 22, color: COLORS.muted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>+</button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
    </div>
  )
}
