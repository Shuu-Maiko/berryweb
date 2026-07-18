import { MoreHorizontal } from "lucide-react"
import { cn } from "../../lib/utils"

export interface JobsHealthCardProps {
  healthyCount?: number
  pausedCount?: number
  failingCount?: number
  className?: string
}

export function JobsHealthCard({
  healthyCount = 24,
  pausedCount = 5,
  failingCount = 2,
  className,
}: JobsHealthCardProps) {
  const total = healthyCount + pausedCount + failingCount
  const healthyPct = total > 0 ? ((healthyCount / total) * 100).toFixed(1) : "0.0"
  const pausedPct = total > 0 ? ((pausedCount / total) * 100).toFixed(1) : "0.0"
  const failingPct = total > 0 ? ((failingCount / total) * 100).toFixed(1) : "0.0"

  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6 shadow-sm", className)}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold text-text-primary">Jobs Health</h3>
        <button className="rounded p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Healthy Jobs */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">Healthy</span>
          <div className="font-heading text-lg font-bold text-text-primary">{healthyCount} Jobs</div>
          <div className="text-[10px] font-bold text-text-muted">{healthyPct}%</div>
          <div className="h-2 w-full rounded-full bg-border/45 overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${healthyPct}%` }} />
          </div>
        </div>

        {/* Paused Jobs */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">Paused</span>
          <div className="font-heading text-lg font-bold text-text-primary">{pausedCount} Jobs</div>
          <div className="text-[10px] font-bold text-text-muted">{pausedPct}%</div>
          <div className="h-2 w-full rounded-full bg-border/45 overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pausedPct}%` }} />
          </div>
        </div>

        {/* Failing Jobs */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase text-error">Failing</span>
          <div className="font-heading text-lg font-bold text-text-primary text-error">{failingCount} Jobs</div>
          <div className="text-[10px] font-bold text-text-muted">{failingPct}%</div>
          <div className="h-2 w-full rounded-full bg-border/45 overflow-hidden">
            <div className="h-full bg-error rounded-full" style={{ width: `${failingPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
