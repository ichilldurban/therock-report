import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { COLORS, PIE_COLORS, ZONE_NAMES } from '../lib/constants'

export default function ZoneChart({ services }) {
  const [svc, setSvc] = useState(0)
  const service = services[svc]

  const zoneData = [
    { name: 'Left', value: parseInt(service.left) || 0 },
    { name: 'Centre', value: parseInt(service.centre) || 0 },
    { name: 'Right', value: parseInt(service.right) || 0 },
    { name: 'Extras', value: parseInt(service.extras) || 0 },
    { name: 'Mothers Rm', value: parseInt(service.mothers) || 0 },
  ]

  const total = zoneData.reduce((s, d) => s + d.value, 0)

  return (
    <div style={{
      background: 'white',
      borderRadius: 18,
      padding: 24,
      marginBottom: 22,
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h2 style={{ fontSize: 20, color: COLORS.primary }}>Zone Breakdown</h2>
        <div style={{ display: 'flex', gap: 3, background: COLORS.light, borderRadius: 20, padding: 3 }}>
          {['8am', '10am'].map((t, i) => (
            <button key={i} onClick={() => setSvc(i)} style={{
              padding: '6px 18px',
              borderRadius: 16,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              background: svc === i ? COLORS.primary : 'transparent',
              color: svc === i ? 'white' : COLORS.muted,
              transition: 'all 0.2s',
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {total > 0 ? (
        <>
          <div style={{ height: 260, marginBottom: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={zoneData}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="white"
                >
                  {zoneData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {zoneData.map((z, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: COLORS.light,
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 12,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i] }} />
                {z.name}: <strong>{z.value}</strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 40, color: COLORS.muted, fontSize: 13 }}>
          No data for this service
        </div>
      )}
    </div>
  )
}
