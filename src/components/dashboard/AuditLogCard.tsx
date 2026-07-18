import { Settings, Bell, CheckCircle2, ShieldAlert } from "lucide-react"
import { cn } from "../../lib/utils"

export interface AuditLogItem {
  id: number
  event: string
  details: string
  user: string
  time: string
  icon: React.ReactNode
  bg: string
}

export interface AuditLogCardProps {
  logs?: AuditLogItem[]
  className?: string
}

const defaultAuditLogs: AuditLogItem[] = [
  {
    id: 1,
    event: "Configuration modified",
    details: "Changed schedule pattern of job 'data-sync-prod' to */15",
    user: "shuu@sypher.com",
    time: "10m ago",
    icon: <Settings className="h-3.5 w-3.5 text-blue-500" />,
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    event: "Alert rule verified",
    details: "Slack webhook connection tested successfully",
    user: "system",
    time: "45m ago",
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    bg: "bg-emerald-500/10",
  },
  {
    id: 3,
    event: "Job paused manually",
    details: "Paused scheduler trigger on 'weekly-email-digest'",
    user: "shuu@sypher.com",
    time: "2h ago",
    icon: <Bell className="h-3.5 w-3.5 text-amber-500" />,
    bg: "bg-amber-500/10",
  },
  {
    id: 4,
    event: "Failure alert dispatched",
    details: "health-check-api failed 3 times recursively",
    user: "scheduler-daemon",
    time: "5h ago",
    icon: <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />,
    bg: "bg-rose-500/10",
  },
]

export function AuditLogCard({
  logs = defaultAuditLogs,
  className,
}: AuditLogCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between", className)}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-text-primary">System Audit Logs</h3>
          <span className="text-[10px] text-text-muted font-semibold">Real-time trails</span>
        </div>

        <div className="relative border-l border-border pl-4 space-y-5 py-2">
          {logs.map((log) => (
            <div key={log.id} className="relative">
              <span className={`absolute -left-[25px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface border border-border ${log.bg}`}>
                {log.icon}
              </span>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-text-primary block">{log.event}</span>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{log.details}</p>
                  <span className="text-[9px] text-text-muted font-medium">By {log.user}</span>
                </div>
                <span className="text-[9px] font-bold text-text-muted shrink-0 mt-0.5 uppercase tracking-wider">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
