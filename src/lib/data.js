import { supabase, isDemo } from './supabase'
import { resizeImage } from './helpers'

const STORAGE_KEY = 'therock-reports-v2'

// Seed data for demo mode
const SEED_DATA = [
  {
    date: '2026-03-09',
    notes: '',
    is_special: false,
    services: [
      { time_slot: '8am', left: 49, centre: 53, right: 33, extras: 3, mothers: 5 },
      { time_slot: '10am', left: 42, centre: 59, right: 34, extras: 11, mothers: 2 },
    ],
    teams: { platform: [], operations: [], frontOfHouse: [] },
    photos: {},
  },
  {
    date: '2026-03-15',
    notes: '',
    is_special: false,
    services: [
      { time_slot: '8am', left: 39, centre: 50, right: 43, extras: 13, mothers: 8 },
      { time_slot: '10am', left: 54, centre: 56, right: 31, extras: 11, mothers: 1 },
    ],
    teams: {
      platform: [
        { role: 'Preaching', name: 'Mark' },
        { role: 'Leading', name: 'Tom & Luke' },
        { role: 'Worship', name: 'Nate' },
      ],
      operations: [
        { role: 'Media', name: 'Luc' },
        { role: 'Tea Team', name: 'Nicole & Merylin' },
        { role: 'Hang Tight', name: 'Stef Coetzee' },
        { role: 'Host', name: 'Gen Coetzee' },
        { role: 'Lockup', name: 'Wayne' },
        { role: 'Tithes', name: 'Crystal & Kelly' },
      ],
      frontOfHouse: [
        { role: 'Welcome Team', name: 'Paige, Karin, Cam & Candice' },
        { role: 'Hosting', name: 'Chad, Lelo, Olo & Duncan' },
        { role: 'Coffee Shop', name: 'Ethan, Bianca & Gareth' },
        { role: 'Car Park', name: 'Flip & Edwin' },
      ],
    },
    photos: {},
  },
]

// ─── LOCAL STORAGE (Demo mode) ───

function getLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function setLocal(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ─── PUBLIC API ───

export async function fetchAllSundays() {
  if (isDemo) {
    let data = getLocal()
    if (!data) {
      setLocal(SEED_DATA)
      data = SEED_DATA
    }
    return data.sort((a, b) => a.date.localeCompare(b.date))
  }

  // Supabase: fetch sundays with related data
  const { data: sundays, error } = await supabase
    .from('sundays')
    .select('*')
    .order('date', { ascending: true })

  if (error) throw error

  const results = await Promise.all(sundays.map(async (sun) => {
    const [servicesRes, teamsRes, photosRes] = await Promise.all([
      supabase.from('services').select('*').eq('sunday_id', sun.id),
      supabase.from('team_members').select('*').eq('sunday_id', sun.id),
      supabase.from('photos').select('*').eq('sunday_id', sun.id).order('sort_order'),
    ])

    const services = (servicesRes.data || []).map(s => ({
      time_slot: s.time_slot,
      left: s.count_left,
      centre: s.count_centre,
      right: s.count_right,
      extras: s.count_extras,
      mothers: s.count_mothers,
    }))

    // Ensure both services exist
    if (!services.find(s => s.time_slot === '8am')) {
      services.unshift({ time_slot: '8am', left: 0, centre: 0, right: 0, extras: 0, mothers: 0 })
    }
    if (!services.find(s => s.time_slot === '10am')) {
      services.push({ time_slot: '10am', left: 0, centre: 0, right: 0, extras: 0, mothers: 0 })
    }
    services.sort((a, b) => a.time_slot === '8am' ? -1 : 1)

    // Group teams
    const teams = { platform: [], operations: [], frontOfHouse: [] }
    for (const tm of (teamsRes.data || [])) {
      if (teams[tm.category]) {
        teams[tm.category].push({ role: tm.role, name: tm.name })
      }
    }

    // Group photos
    const photos = {}
    for (const p of (photosRes.data || [])) {
      if (!photos[p.category]) photos[p.category] = []
      photos[p.category].push(p.url)
    }

    return {
      id: sun.id,
      date: sun.date,
      notes: sun.notes || '',
      is_special: sun.is_special,
      services,
      teams,
      photos,
    }
  }))

  return results
}

export async function fetchSundayByDate(date) {
  const all = await fetchAllSundays()
  return all.find(s => s.date === date) || null
}

export async function saveSunday(entry) {
  if (isDemo) {
    const data = getLocal() || []
    const idx = data.findIndex(d => d.date === entry.date)
    if (idx >= 0) {
      data[idx] = entry
    } else {
      data.push(entry)
    }
    data.sort((a, b) => a.date.localeCompare(b.date))
    setLocal(data)
    return entry
  }

  // Supabase: upsert sunday
  const { data: sun, error: sunErr } = await supabase
    .from('sundays')
    .upsert({ date: entry.date, notes: entry.notes || '', is_special: entry.is_special || false }, { onConflict: 'date' })
    .select()
    .single()

  if (sunErr) throw sunErr
  const sundayId = sun.id

  // Delete old related data and re-insert
  await Promise.all([
    supabase.from('services').delete().eq('sunday_id', sundayId),
    supabase.from('team_members').delete().eq('sunday_id', sundayId),
    supabase.from('photos').delete().eq('sunday_id', sundayId),
  ])

  // Insert services
  const serviceRows = entry.services.map(s => ({
    sunday_id: sundayId,
    time_slot: s.time_slot,
    count_left: parseInt(s.left) || 0,
    count_centre: parseInt(s.centre) || 0,
    count_right: parseInt(s.right) || 0,
    count_extras: parseInt(s.extras) || 0,
    count_mothers: parseInt(s.mothers) || 0,
  }))
  await supabase.from('services').insert(serviceRows)

  // Insert team members
  const teamRows = []
  for (const [category, members] of Object.entries(entry.teams || {})) {
    for (const m of members) {
      if (m.name && m.name.trim()) {
        teamRows.push({ sunday_id: sundayId, category, role: m.role, name: m.name.trim() })
      }
    }
  }
  if (teamRows.length > 0) {
    await supabase.from('team_members').insert(teamRows)
  }

  // Insert photo URLs (photos should already be uploaded)
  const photoRows = []
  for (const [category, urls] of Object.entries(entry.photos || {})) {
    urls.forEach((url, i) => {
      photoRows.push({ sunday_id: sundayId, category, url, sort_order: i })
    })
  }
  if (photoRows.length > 0) {
    await supabase.from('photos').insert(photoRows)
  }

  return { ...entry, id: sundayId }
}

export async function deleteSunday(date) {
  if (isDemo) {
    const data = (getLocal() || []).filter(d => d.date !== date)
    setLocal(data)
    return
  }

  const { data: sun } = await supabase
    .from('sundays')
    .select('id')
    .eq('date', date)
    .single()

  if (sun) {
    await supabase.from('sundays').delete().eq('id', sun.id)
  }
}

export async function uploadPhoto(file, date, category, index) {
  if (isDemo) {
    // In demo mode, convert to data URL
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })
  }

  const resized = await resizeImage(file)
  const path = `${date}/${category}/${index}_${Date.now()}.jpg`

  const { error } = await supabase.storage
    .from('service-photos')
    .upload(path, resized, { contentType: 'image/jpeg', upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('service-photos')
    .getPublicUrl(path)

  return data.publicUrl
}

// ─── AUTH ───

export async function signUp(email, password, name) {
  if (isDemo) {
    // Demo mode: simulate registration
    return { user: { email, user_metadata: { full_name: name } } }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  if (isDemo) {
    // Demo mode: accept any credentials
    return { user: { email: 'admin@demo.local' } }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  if (isDemo) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (isDemo) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthChange(callback) {
  if (isDemo) return { data: { subscription: { unsubscribe: () => {} } } }
  return supabase.auth.onAuthStateChange(callback)
}
