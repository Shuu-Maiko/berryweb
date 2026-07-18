import { MoreHorizontal } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ConcurrencyCardProps {
  activeCount?: number
  limit?: number
  heights?: number[]
  className?: string
}

export function ConcurrencyCard({
  activeCount = 12,
  limit = 15,
  heights = [45, 52, 50, 48, 55, 60, 58, 62, 40, 35, 74, 58, 61, 55, 50, 65, 68, 73, 70, 74, 66, 70],
  className,
}: ConcurrencyCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5 shadow-sm flex flex-col justify-between", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-xs font-bold text-text-primary">Job Concurrency</h3>
          <div className="font-heading text-lg font-bold text-text-primary mt-1">{activeCount} active</div>
        </div>
        <div className="flex flex-col items-end">
          <button className="rounded p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
          <span className="text-[9px] text-text-muted mt-1 font-semibold">Limit: &lt;{limit} active</span>
        </div>
      </div>

      <div className="relative mt-4 h-24 w-full">
        <svg className="h-full w-full overflow-visible" viewBox="0 0 160 80" preserveAspectRatio="none">
          <line
            x1="0"
            y1="10"
            x2="160"
            y2="10"
            className="stroke-error stroke-dashed"
            strokeWidth={0.75}
            strokeDasharray="2,2"
          />
          {Array.from({ length: 22 }).map((_, idx) => {
            const h = heights[idx] || 40
            const x = idx * 7
            const isHigh = h >= 70
            return (
              <rect
                key={idx}
                x={x}
                y={80 - h}
                width={4}
                height={h}
                className={isHigh ? "fill-error" : "fill-primary"}
                rx={0.5}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
