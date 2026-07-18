export type JobType = "PRINT_LOG" | "WEBHOOK"

export interface Job {
  id: string          // Normalized UUID
  name: string
  cronExpression: string
  jobType: JobType
  message: string
  url: string
  httpMethod: string
  payload: string
  httpHeaders?: Record<string, string> // NEW (optional headers)
  createdAt: string
  end: string | null
  status?: string
  lastRunTime: string | null
  lastRunStatus: string | null
  nextRunTime: string | null
  lastRun: {
    durationMs: number
  } | null
  notifyOnFailure: boolean // NEW
  notifyOnSuccess: boolean // NEW
}

export interface JobRequest {
  name: string
  cronString: string
  jobType: JobType
  message?: string
  url?: string
  httpMethod?: string
  httpHeaders?: Record<string, string>
  payload?: string
  notifyOnFailure?: boolean // NEW
  notifyOnSuccess?: boolean // NEW
}
