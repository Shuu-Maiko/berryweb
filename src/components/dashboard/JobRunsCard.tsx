import { Terminal, MoreHorizontal, ArrowUpRight } from "lucide-react"
import { cn } from "../../lib/utils"

export interface JobRunsCardProps {
  successRate?: number
  precision?: number
  totalRuns?: number
  totalRunsTrend?: string
  className?: string
}

export function JobRunsCard({
  successRate = 99.2,
  precision = 99.9,
  totalRuns = 1352,
  totalRunsTrend = "+3.5%",
  className,
}: JobRunsCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6 shadow-sm", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold text-text-primary flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" /> Job Runs
        </h3>
        <button className="rounded p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Success Rate */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">Execution success</span>
            <div className="font-heading text-xl font-bold text-text-primary mt-0.5">{successRate}%</div>
          </div>
          <div className="relative h-10 w-full">
            <svg className="h-full w-full" viewBox="0 0 120 40" preserveAspectRatio="none">
              {Array.from({ length: 18 }).map((_, idx) => {
                const heights = [28, 30, 22, 29, 32, 35, 27, 36, 31, 38, 33, 35, 37, 30, 34, 38, 36, 39]
                const h = heights[idx] || 30
                const x = idx * 6.5
                const hasFailure = idx === 3 || idx === 11
                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={40 - h}
                      width={4.5}
                      height={hasFailure ? h * 0.75 : h}
                      className="fill-primary"
                      rx={1}
                    />
                    {hasFailure && (
                      <rect
                        x={x}
                        y={40 - h + h * 0.75}
                        width={4.5}
                        height={h * 0.25}
                        className="fill-error"
                        rx={1}
                      />
                    )}
                  </g>
                )
              })}
              <polygon points="97.5,0 100.5,4 94.5,4" className="fill-primary" />
            </svg>
          </div>
        </div>

        {/* Scheduler Precision */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">Scheduler Precision</span>
            <div className="font-heading text-xl font-bold text-text-primary mt-0.5">{precision}%</div>
          </div>
          <div className="relative pt-2">
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-emerald-500" />
            <div className="absolute top-[2px] left-[98%] flex flex-col items-center">
              <div className="h-0 w-0 border-x-[4px] border-x-transparent border-t-[5px] border-t-text-primary" />
            </div>
          </div>
        </div>

        {/* Total Executions */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">Total runs</span>
              <span className="inline-flex items-center text-[10px] font-bold text-primary">
                {totalRunsTrend} <ArrowUpRight className="ml-0.5 h-2.5 w-2.5" />
              </span>
            </div>
            <div className="font-heading text-xl font-bold text-text-primary mt-0.5">{totalRuns.toLocaleString()}</div>
          </div>
          <div className="h-10 w-full">
            <svg className="h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#15a347" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#15a347" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 25 L 8 20 L 16 23 L 24 15 L 32 18 L 40 10 L 48 14 L 56 6 L 64 12 L 72 4 L 80 8 L 88 2 L 96 3 L 100 2"
                fill="none"
                stroke="#15a347"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <path
                d="M 0 25 L 8 20 L 16 23 L 24 15 L 32 18 L 40 10 L 48 14 L 56 6 L 64 12 L 72 4 L 80 8 L 88 2 L 96 3 L 100 2 L 100 30 L 0 30 Z"
                fill="url(#sparklineGrad)"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
