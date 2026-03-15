import { COLORS, TEAM_SECTIONS } from '../lib/constants'

export default function ServingTeams({ teams }) {
  if (!teams) return null

  const hasTeams = TEAM_SECTIONS.some(section =>
    teams[section.key]?.some(m => m.name && m.name.trim())
  )
  if (!hasTeams) return null

  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 22, color: COLORS.primary, textAlign: 'center', margin: '36px 0 18px' }}>
        Serving Teams
      </h2>

      {TEAM_SECTIONS.map(section => {
        const members = teams[section.key]?.filter(m => m.name && m.name.trim()) || []
        if (members.length === 0) return null

        return (
          <div key={section.key} style={{
            background: 'white',
            borderRadius: 14,
            padding: 20,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            marginBottom: 14,
            borderLeft: `4px solid ${section.color}`,
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: section.color,
            }}>
              {section.icon} {section.title}
            </div>
            {members.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 0',
                borderBottom: i < members.length - 1 ? `1px solid ${COLORS.border}` : 'none',
              }}>
                <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>{m.role}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
