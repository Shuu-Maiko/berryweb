export interface CronJobItem {
  id: string
  name: string
  schedule: string
  lastRun: string
  nextRun: string
  status: "Success" | "Failed" | "Paused" | "Running"
  avgDuration: string
}

export interface ExecutionData {
  time: string
  totalRuns: number
  failures: number
  duration: number
}

export interface LogEntry {
  timestamp: string
  level: "info" | "warn" | "error"
  message: string
}
