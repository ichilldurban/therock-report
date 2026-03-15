import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { COLORS } from '../lib/constants'
import { totalOf } from '../lib/helpers'

export default function ComparisonChart({ currentServices, prevServices, currentDate, prevDate }) {
  if (!prevServices) return null

  const data = [
    {
      name: prevDate || 'Last week',
      '8am': totalOf(prevServices[0]),
      '10am': totalOf(prevServices[1]),
    },
    {
      name: currentDate || 'This week',
      '8am': totalOf(currentServices[0]),
      '10am': totalOf(currentServices[1]),
    },
  ]

  return (
    <div style={{
      background: 'white',
      borderRadius: 18,
      padding: 24,
      marginBottom: 22,
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    }}>
      <h2 style={{ fontSize: 20, color: COLORS.primary, marginBottom: 18 }}>
        Week-on-Week Comparison
      </h2>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="8am" fill={COLORS.blue} radius={[6, 6, 0, 0]} />
            <Bar dataKey="10am" fill={COLORS.accent} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
