export function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function formatDuration(ms) {
  if (ms === null || ms === undefined) return null
  if (ms < 1000) return `${ms.toLocaleString()}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export function shortId(id, len = 8) {
  return id ? id.slice(0, len) : ''
}

export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const secs = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
