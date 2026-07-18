import { CronExpressionParser } from "cron-parser"

/**
 * Calculates relative next execution duration from a cron expression.
 * Handles both standard 5-field and Spring-style 6-field cron strings.
 */
export function getNextRun(cron: string): string {
  if (!cron) return "-"

  let normalizedCron = cron.trim()
  const parts = normalizedCron.split(/\s+/)
  const hasSeconds = parts.length === 6

  try {
    const interval = CronExpressionParser.parse(normalizedCron, {
      currentDate: new Date(),
      hasSeconds,
    })
    const nextVal = interval.next()
    const nextDate = (nextVal && typeof nextVal.toDate === "function")
      ? nextVal.toDate()
      : (nextVal as any)?.value?.toDate() || new Date()

    const diffMs = nextDate.getTime() - new Date().getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "under a min"
    if (diffMins < 60) return `${diffMins} min`
    
    const hrs = Math.floor(diffMins / 60)
    if (hrs < 24) return `${hrs} hours`
    
    return `${Math.floor(hrs / 24)} days`
  } catch {
    return "-"
  }
}
