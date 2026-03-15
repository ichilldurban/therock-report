import { COLORS } from '../lib/constants'
import { totalOf } from '../lib/helpers'

export default function StatCards({ services, prevServices }) {
  const total8 = totalOf(services[0])
  const total10 = totalOf(services[1])
  const combined = total8 + total10

  let diff = null
  if (prevServices) {
    const prevCombined = totalOf(prevServices[0]) + totalOf(prevServices[1])
    diff = combined - prevCombined
  }

  const cards = [
    { label: '8am Service', value: total8, color: COLORS.blue },
    { label: '10am Service', value: total10, color: COLORS.accent },
    { label: 'Combined', value: combined, color: COLORS.green, diff },
  ]

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          background: 'white',
          borderRadius: 16,
          padding: '24px 16px',
          textAlign: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          flex: '1 1 140px',
          minWidth: 140,
          borderTop: `4px solid ${card.color}`,
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 40,
            fontWeight: 700,
            color: card.color,
            letterSpacing: -1,
          }}>
            {card.value}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>
            {card.label}
          </div>
          {card.diff !== null && (
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>
              {card.diff >= 0 ? '+' : ''}{card.diff} from last week
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
