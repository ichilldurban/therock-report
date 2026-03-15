export const COLORS = {
  primary: '#1B5E3B',
  accent: '#1B5E3B',
  green: '#1B5E3B',
  blue: '#3B7DD8',
  rose: '#D4495A',
  gold: '#C4960C',
  cream: '#FFFFFF',
  light: '#F5F7FA',
  border: '#E5E7EB',
  text: '#1a1a1a',
  muted: '#6B7280',
}

export const PIE_COLORS = ['#3B7DD8', '#1B5E3B', '#6B7280', '#D4495A', '#C4960C']
// Left=blue, Centre=green, Right=grey, Extras=rose, Mothers=gold

export const ZONE_NAMES = ['Left', 'Centre', 'Right', 'Extras', 'Mothers Rm']

export const EMPTY_SERVICE = { left: '', centre: '', right: '', extras: '', mothers: '' }

export const EMPTY_TEAMS = {
  platform: [
    { role: 'Preaching', name: '' },
    { role: 'Leading', name: '' },
    { role: 'Worship', name: '' },
  ],
  operations: [
    { role: 'Media', name: '' },
    { role: 'Tea Team', name: '' },
    { role: 'Hang Tight', name: '' },
    { role: 'Host', name: '' },
    { role: 'Lockup', name: '' },
    { role: 'Tithes', name: '' },
  ],
  frontOfHouse: [
    { role: 'Welcome Team', name: '' },
    { role: 'Hosting', name: '' },
    { role: 'Coffee Shop', name: '' },
    { role: 'Car Park', name: '' },
  ],
}

export const TEAM_SECTIONS = [
  { key: 'platform', title: 'Platform', icon: '🎤', color: COLORS.primary },
  { key: 'operations', title: 'Operations', icon: '⚙️', color: '#374151' },
  { key: 'frontOfHouse', title: 'Front of House', icon: '👋', color: COLORS.blue },
]

export const PHOTO_CATEGORIES = [
  { key: 'worship8', label: '8am Worship', sublabel: 'Congregation standing · Kids upstairs' },
  { key: 'service8', label: '8am Service (Count)', sublabel: 'Congregation seated · Count taken' },
  { key: 'worship10', label: '10am Worship', sublabel: 'Congregation standing · Kids upstairs' },
  { key: 'service10', label: '10am Service (Count)', sublabel: 'Congregation seated · Count taken' },
]
