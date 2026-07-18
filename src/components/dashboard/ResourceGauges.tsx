import { Cpu } from "lucide-react"
import { cn } from "../../lib/utils"

export interface ResourceGaugesProps {
  cpuPct?: number
  memoryPct?: number
  diskPct?: number
  cpuModel?: string
  memoryUsage?: string
  diskUsage?: string
  nodeName?: string
  className?: string
}

export function ResourceGauges({
  cpuPct = 42,
  memoryPct = 68,
  diskPct = 38,
  cpuModel = "Intel Xeon 2.8GHz",
  memoryUsage = "2.72GB / 4.0GB",
  diskUsage = "15.2GB / 40.0GB",
  nodeName = "worker-us-east-4",
  className,
}: ResourceGaugesProps) {
  const getOffset = (pct: number) => {
    const cleanPct = Math.max(0, Math.min(100, pct))
    return 289 - (cleanPct / 100) * 289
  }

  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between lg:col-span-6", className)}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-text-primary flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" /> System Resource Gauges
          </h3>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Diagnostic Component</span>
        </div>

        <p className="text-xs text-text-muted mb-4">
          Real-time hardware resource consumption metrics of the Berry scheduler daemon agent.
        </p>

        {/* Circular progress loop gauges */}
        <div className="grid grid-cols-3 gap-6 py-4">
          {/* CPU Gauge */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-28 w-28">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" className="stroke-border" strokeWidth="7.5" fill="transparent" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-primary transition-all duration-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="289"
                  strokeDashoffset={getOffset(cpuPct)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-text-primary">{cpuPct}%</span>
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-0.5">CPU</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-text-secondary mt-1">{cpuModel}</span>
          </div>

          {/* Memory Gauge */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-28 w-28">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" className="stroke-border" strokeWidth="7.5" fill="transparent" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-[#fb923c] transition-all duration-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="289"
                  strokeDashoffset={getOffset(memoryPct)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-text-primary">{memoryPct}%</span>
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-0.5">MEM</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-text-secondary mt-1">{memoryUsage}</span>
          </div>

          {/* Disk Gauge */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-28 w-28">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" className="stroke-border" strokeWidth="7.5" fill="transparent" />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-primary transition-all duration-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="289"
                  strokeDashoffset={getOffset(diskPct)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-text-primary">{diskPct}%</span>
                <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider mt-0.5">DISK</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-text-secondary mt-1">{diskUsage}</span>
          </div>
        </div>
      </div>

      {/* Diagnostic Status Indicator */}
      <div className="mt-5 border-t border-border/50 pt-4 flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        <span className="text-[10px] text-text-secondary font-bold">
          Scheduler agent running on node <code className="bg-canvas border border-border px-1 rounded font-mono">{nodeName}</code> (Healthy)
        </span>
      </div>
    </div>
  )
}
