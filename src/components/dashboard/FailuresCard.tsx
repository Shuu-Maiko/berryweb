import { MoreHorizontal } from "lucide-react"
import { cn } from "../../lib/utils"

export interface FailureItem {
  name: string
  amount: string
  pct: number
  color: string
}

export interface FailuresCardProps {
  data?: FailureItem[]
  title?: string
  className?: string
}

const defaultFailures: FailureItem[] = [
  { name: "data-sync-prod", amount: "42 failures", pct: 35, color: "bg-[#15a347]" },
  { name: "db-backup-daily", amount: "30 failures", pct: 25, color: "bg-[#4ade80]" },
  { name: "health-check-api", amount: "18 failures", pct: 15, color: "bg-[#a3e635]" },
  { name: "stripe-reconcile", amount: "12 failures", pct: 10, color: "bg-[#facc15]" },
  { name: "weekly-email-digest", amount: "8 failures", pct: 7, color: "bg-[#fb923c]" },
  { name: "image-optimizer", amount: "6 failures", pct: 5, color: "bg-[#f87171]" },
]

export function FailuresCard({
  data = defaultFailures,
  title = "Failures by service",
  className,
}: FailuresCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5 shadow-sm flex flex-col justify-between", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-xs font-bold text-text-primary">{title}</h3>
        <button className="rounded p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {data.map((cat) => (
          <div key={cat.name} className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-text-secondary truncate max-w-[100px]">{cat.name}</span>
              <span className="text-text-primary">
                {cat.amount} <span className="text-text-muted font-normal ml-1">{cat.pct}%</span>
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
              <div
                className={cn("h-full rounded-full", cat.color)}
                style={{ width: `${cat.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
