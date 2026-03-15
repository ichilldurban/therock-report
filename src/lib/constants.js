export const COLORS = {
  primary: '#1a3a5c',
  accent: '#e8913a',
  green: '#4a8c6f',
  blue: '#4a7cb5',
  rose: '#c4626e',
  gold: '#d4a020',
  cream: '#faf8f5',
  light: '#f7f3ef',
  border: '#e8e4df',
  text: '#2c2c2c',
  muted: '#7a7a7a',
}

export const PIE_COLORS = ['#4a7cb5', '#e8913a', '#4a8c6f', '#c4626e', '#d4a020']
// Left=blue, Centre=orange, Right=green, Extras=rose, Mothers=gold

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
  { key: 'operations', title: 'Operations', icon: '⚙️', color: COLORS.accent },
  { key: 'frontOfHouse', title: 'Front of House', icon: '👋', color: COLORS.green },
]

export const PHOTO_CATEGORIES = [
  { key: 'worship8', label: '8am Worship', sublabel: 'Congregation standing · Kids upstairs' },
  { key: 'service8', label: '8am Service (Count)', sublabel: 'Congregation seated · Count taken' },
  { key: 'worship10', label: '10am Worship', sublabel: 'Congregation standing · Kids upstairs' },
  { key: 'service10', label: '10am Service (Count)', sublabel: 'Congregation seated · Count taken' },
]
