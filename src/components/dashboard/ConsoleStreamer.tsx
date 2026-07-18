import { useState, useEffect, useMemo } from "react"
import { Terminal, Play, Pause, Trash2, RefreshCw } from "lucide-react"
import type { LogEntry } from "./types"
import { cn } from "../../lib/utils"

export interface ConsoleStreamerProps {
  title?: string
  initialLogs?: LogEntry[]
  className?: string
}

const defaultLogs: LogEntry[] = [
  { timestamp: "12:58:10", level: "info", message: "Cron scheduler core agent started (v1.4.2)" },
  { timestamp: "12:58:12", level: "info", message: "Loaded 14 active tasks configurations from local database" },
  { timestamp: "12:58:15", level: "info", message: "Triggered execution for job 'health-check-api'" },
  { timestamp: "12:58:16", level: "error", message: "Job 'health-check-api' failed: HTTP response status 503 Service Unavailable" },
  { timestamp: "12:59:00", level: "info", message: "Triggered execution for job 'data-sync-prod'" },
  { timestamp: "12:59:01", level: "info", message: "Job 'data-sync-prod' successfully run in 1.2s" },
  { timestamp: "13:00:00", level: "warn", message: "DB query load exceeds threshold limit: 84% usage detected" },
]

export function ConsoleStreamer({
  title = "Live Console Streamer",
  initialLogs = defaultLogs,
  className,
}: ConsoleStreamerProps) {
  const [isPlayingLogs, setIsPlayingLogs] = useState(true)
  const [logFilter, setLogFilter] = useState<"All" | "Info" | "Warning" | "Error">("All")
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)

  useEffect(() => {
    if (!isPlayingLogs) return
    const interval = setInterval(() => {
      const items: { level: "info" | "warn" | "error"; message: string }[] = [
        { level: "info", message: "Job 'data-sync-prod' successfully run in 1.1s" },
        { level: "info", message: "Cron scheduler core agent heartbeat sent successfully" },
        { level: "warn", message: "Job 'db-backup-daily' query CPU threshold exceeds warning limit of 80%" },
        { level: "info", message: "Triggered execution for job 'log-rotator-sys'" },
        { level: "error", message: "Failed connection response from API target: 502 Bad Gateway" },
        { level: "info", message: "Successfully purged 142 expired user session database logs" },
        { level: "info", message: "Cron cache cleared successfully (0.8s execution)" },
      ]
      const randomItem = items[Math.floor(Math.random() * items.length)]
      const timestamp = new Date().toTimeString().split(" ")[0]
      setLogs((prev) => [
        ...prev.slice(-30),
        { timestamp, level: randomItem.level, message: randomItem.message }
      ])
    }, 2000)
    return () => clearInterval(interval)
  }, [isPlayingLogs])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (logFilter === "All") return true
      if (logFilter === "Info") return log.level === "info"
      if (logFilter === "Warning") return log.level === "warn"
      if (logFilter === "Error") return log.level === "error"
      return true
    })
  }, [logs, logFilter])

  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between lg:col-span-6", className)}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-text-primary flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" /> {title}
          </h3>
          <div className="flex items-center gap-1.5">
            {(["All", "Info", "Warning", "Error"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setLogFilter(filter)}
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer",
                  logFilter === filter ? "bg-primary text-white" : "bg-surface-elevated text-text-secondary hover:text-text-primary"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 h-56 font-mono text-[11px] leading-relaxed text-neutral-300 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-neutral-700 select-all">
          {filteredLogs.slice(-10).map((log, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-neutral-500 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={cn(
                "font-bold select-none shrink-0",
                log.level === "info" && "text-emerald-400",
                log.level === "warn" && "text-yellow-400",
                log.level === "error" && "text-rose-400"
              )}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="text-neutral-200">{log.message}</span>
            </div>
          ))}
          {isPlayingLogs && (
            <div className="flex gap-1.5 items-center text-neutral-500 text-[10px] select-none animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Listening for schedules...</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlayingLogs(!isPlayingLogs)}
            className="flex items-center gap-1.5 rounded-md bg-primary hover:bg-primary-hover text-white px-3 py-1.5 text-xs font-bold cursor-pointer transition-all shadow-sm"
          >
            {isPlayingLogs ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-white" /> Pause Stream
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" /> Resume Stream
              </>
            )}
          </button>
          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary px-3 py-1.5 text-xs font-bold cursor-pointer transition-all"
          >
            <Trash2 className="h-3.5 w-3.5 text-text-muted" /> Clear
          </button>
        </div>
        
        <button
          onClick={() => {
            const logData = logs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join("\n")
            const blob = new Blob([logData], { type: "text/plain" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "berry_agent_logs.log"
            link.click()
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-text-secondary bg-surface border border-border hover:bg-surface-elevated hover:text-text-primary px-3 py-1.5 rounded cursor-pointer transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5 text-text-muted" /> Download Logs
        </button>
      </div>
    </div>
  )
}
