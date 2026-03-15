import { COLORS } from '../lib/constants'
import { totalOf, formatDate } from '../lib/helpers'

export default function ShareButton({ sunday }) {
  if (!sunday) return null

  const total8 = totalOf(sunday.services[0])
  const total10 = totalOf(sunday.services[1])
  const combined = total8 + total10
  const dateStr = formatDate(sunday.date)

  const reportUrl = `${window.location.origin}/report/${sunday.date}`

  const shareText = `Hey team! 🙏\n\nHere's this Sunday's service report (${dateStr}):\n\n📊 8am: ${total8} | 10am: ${total10} | Combined: ${combined}\n\nFull report with charts, photos & serving team roster:\n${reportUrl}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `The Rock — Sunday Report ${dateStr}`,
          text: `Sunday ${dateStr}: 8am ${total8} | 10am ${total10} | Combined ${combined}`,
          url: reportUrl,
        })
      } catch (e) {
        if (e.name !== 'AbortError') {
          fallbackCopy()
        }
      }
    } else {
      fallbackCopy()
    }
  }

  const fallbackCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Report link copied to clipboard!')
    }).catch(() => {
      // Open WhatsApp directly
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
    })
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
  }

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
      <button onClick={handleShare} style={{
        flex: 1,
        padding: '14px 16px',
        borderRadius: 14,
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        background: COLORS.green,
        color: 'white',
        boxShadow: '0 3px 12px rgba(27,94,59,0.25)',
      }}>
        📤 Share Report
      </button>
      <button onClick={handleWhatsApp} style={{
        padding: '14px 20px',
        borderRadius: 14,
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        background: '#25D366',
        color: 'white',
        boxShadow: '0 3px 12px rgba(37,211,102,0.3)',
      }}>
        WhatsApp
      </button>
    </div>
  )
}
