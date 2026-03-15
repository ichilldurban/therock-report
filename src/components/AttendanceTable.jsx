import { COLORS } from '../lib/constants'
import { totalOf } from '../lib/helpers'

export default function AttendanceTable({ services }) {
  const s8 = services[0]
  const s10 = services[1]
  const combined = {
    left: (parseInt(s8.left)||0) + (parseInt(s10.left)||0),
    centre: (parseInt(s8.centre)||0) + (parseInt(s10.centre)||0),
    right: (parseInt(s8.right)||0) + (parseInt(s10.right)||0),
    extras: (parseInt(s8.extras)||0) + (parseInt(s10.extras)||0),
    mothers: (parseInt(s8.mothers)||0) + (parseInt(s10.mothers)||0),
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 18,
      padding: 24,
      marginBottom: 22,
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    }}>
      <h2 style={{ fontSize: 20, color: COLORS.primary, marginBottom: 18 }}>
        Full Attendance Detail
      </h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: COLORS.primary, color: 'white' }}>
              {['Service', 'Left', 'Centre', 'Right', 'Extras', 'Moms Rm', 'Total'].map(h => (
                <th key={h} style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="8am" service={s8} />
            <Row label="10am" service={s10} even />
            <tr style={{ background: COLORS.primary, color: 'white', fontWeight: 700 }}>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>COMBINED</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{combined.left}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{combined.centre}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{combined.right}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{combined.extras}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center' }}>{combined.mothers}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: 15 }}>
                {totalOf(s8) + totalOf(s10)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Row({ label, service, even }) {
  return (
    <tr style={{ background: even ? COLORS.light : 'white' }}>
      <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700 }}>{label}</td>
      <td style={{ padding: '10px 8px', textAlign: 'center' }}>{service.left}</td>
      <td style={{ padding: '10px 8px', textAlign: 'center' }}>{service.centre}</td>
      <td style={{ padding: '10px 8px', textAlign: 'center' }}>{service.right}</td>
      <td style={{ padding: '10px 8px', textAlign: 'center' }}>{service.extras}</td>
      <td style={{ padding: '10px 8px', textAlign: 'center' }}>{service.mothers}</td>
      <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 800, color: COLORS.primary }}>
        {totalOf(service)}
      </td>
    </tr>
  )
}
