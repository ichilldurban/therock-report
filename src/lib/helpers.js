export function totalOf(s) {
  return (parseInt(s.left) || 0) +
    (parseInt(s.centre) || 0) +
    (parseInt(s.right) || 0) +
    (parseInt(s.extras) || 0) +
    (parseInt(s.mothers) || 0)
}

export function formatDate(dateStr) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateLong(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export function resizeImage(file, maxWidth = 1200, quality = 0.75) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let w = img.width, h = img.height
        if (w > maxWidth) { h = h * maxWidth / w; w = maxWidth }
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}
