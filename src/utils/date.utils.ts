/**
 * Formats an ISO date string into a relative format (e.g. 5 min ago).
 */
export function getRelativeTime(isoDate: string | null | undefined): string {
  if (!isoDate) return "Never"
  
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return "Never"
  
  const diffMs = new Date().getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  
  const hrs = Math.floor(diffMins / 60)
  if (hrs < 24) return `${hrs} hours ago`
  
  return `${Math.floor(hrs / 24)} days ago`
}

/**
 * Formats an ISO date string into a readable full format.
 */
export function formatFullDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "-"
  
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return "-"
  
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}
