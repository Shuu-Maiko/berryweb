import type { CronJobItem, ExecutionData } from "./types"

export const mockCronJobs: CronJobItem[] = [
  { id: "1", name: "data-sync-prod", schedule: "*/15 * * * *", lastRun: "2 min ago", nextRun: "13 min", status: "Running", avgDuration: "1.2s" },
  { id: "2", name: "db-backup-daily", schedule: "0 3 * * *", lastRun: "1 hour ago", nextRun: "2 hours", status: "Success", avgDuration: "15.4s" },
  { id: "3", name: "health-check-api", schedule: "*/5 * * * *", lastRun: "1 min ago", nextRun: "4 min", status: "Failed", avgDuration: "0.3s" },
  { id: "4", name: "report-generator", schedule: "0 9 * * 1", lastRun: "2 days ago", nextRun: "5 days", status: "Paused", avgDuration: "45.2s" },
  { id: "5", name: "cache-clear-redis", schedule: "0 */6 * * *", lastRun: "3 hours ago", nextRun: "3 hours", status: "Success", avgDuration: "0.8s" },
  { id: "6", name: "stripe-reconcile", schedule: "30 2 * * *", lastRun: "10 hours ago", nextRun: "14 hours", status: "Failed", avgDuration: "4.5s" },
  { id: "7", name: "image-optimizer", schedule: "0 */2 * * *", lastRun: "1 hour ago", nextRun: "1 hour", status: "Success", avgDuration: "8.1s" },
  { id: "8", name: "log-rotator-sys", schedule: "0 0 * * *", lastRun: "12 hours ago", nextRun: "12 hours", status: "Success", avgDuration: "2.1s" },
  { id: "9", name: "temp-file-cleaner", schedule: "0 4 * * *", lastRun: "8 hours ago", nextRun: "16 hours", status: "Success", avgDuration: "1.5s" },
  { id: "10", name: "weekly-email-digest", schedule: "0 12 * * 0", lastRun: "2 days ago", nextRun: "5 days", status: "Paused", avgDuration: "35.2s" },
  { id: "11", name: "search-index-rebuild", schedule: "0 2 * * *", lastRun: "10 hours ago", nextRun: "14 hours", status: "Success", avgDuration: "12.8s" },
  { id: "12", name: "session-cleanup", schedule: "*/30 * * * *", lastRun: "14 min ago", nextRun: "16 min", status: "Running", avgDuration: "0.4s" },
  { id: "13", name: "user-analytics-rollup", schedule: "0 1 * * *", lastRun: "11 hours ago", nextRun: "13 hours", status: "Success", avgDuration: "6.3s" },
  { id: "14", name: "ssl-cert-monitor", schedule: "0 6 * * *", lastRun: "6 hours ago", nextRun: "18 hours", status: "Success", avgDuration: "1.8s" },
]

export const executionHistoryData: ExecutionData[] = [
  { time: "08:00", totalRuns: 110, failures: 1, duration: 420 },
  { time: "10:00", totalRuns: 135, failures: 3, duration: 490 },
  { time: "12:00", totalRuns: 120, failures: 0, duration: 450 },
  { time: "14:00", totalRuns: 145, failures: 2, duration: 520 },
  { time: "16:00", totalRuns: 175, failures: 4, duration: 580 },
  { time: "18:00", totalRuns: 155, failures: 1, duration: 510 },
  { time: "20:00", totalRuns: 165, failures: 2, duration: 540 },
  { time: "22:00", totalRuns: 190, failures: 5, duration: 610 },
  { time: "00:00", totalRuns: 130, failures: 1, duration: 470 },
  { time: "02:00", totalRuns: 177, failures: 1, duration: 850 },
  { time: "04:00", totalRuns: 140, failures: 2, duration: 490 },
]
