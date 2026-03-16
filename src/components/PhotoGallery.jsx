import { useState } from 'react'
import { COLORS, PHOTO_CATEGORIES } from '../lib/constants'

export default function PhotoGallery({ photos }) {
  const [lightboxSrc, setLightboxSrc] = useState(null)

  const hasPhotos = photos && PHOTO_CATEGORIES.some(cat => photos[cat.key]?.length > 0)

  return (
    <div>
      <h2 style={{ fontSize: 22, color: COLORS.primary, textAlign: 'center', margin: '36px 0 16px' }}>
        Service Photos
      </h2>

      {!hasPhotos && (
        <div style={{
          textAlign: 'center',
          padding: '32px 16px',
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
          marginBottom: 22,
        }}>
          <div style={{ fontSize: 40, marginBottom: 10, opacity: 0.4 }}>📷</div>
          <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.5 }}>
            No photos uploaded yet for this Sunday.
          </p>
          <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
            Photos can be added via the Admin entry page.
          </p>
        </div>
      )}

      {hasPhotos && PHOTO_CATEGORIES.map(cat => {
        const images = photos[cat.key] || []
        if (images.length === 0) return null

        return (
          <div key={cat.key} style={{ marginBottom: 22 }}>
            <h3 style={{ fontSize: 18, color: COLORS.primary, textAlign: 'center', margin: '24px 0 6px' }}>
              {cat.label}
            </h3>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, textAlign: 'center', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {cat.sublabel}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: images.length === 1 ? '1fr' : '1fr 1fr',
              gap: 10,
            }}>
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${cat.label} ${i + 1}`}
                  onClick={() => setLightboxSrc(src)}
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>
        )
      })}

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="Enlarged view" />
        </div>
      )}
    </div>
  )
}
