import { useState, useMemo, useEffect } from "react"
import { Copy } from "lucide-react"
import { cn } from "../../lib/utils"
import { CronExpressionParser } from "cron-parser"

export interface CronBuilderProps {
  onExpressionChange?: (cron: string) => void
  className?: string
}

export function CronBuilder({ onExpressionChange, className }: CronBuilderProps) {
  const [frequency, setFrequency] = useState<"seconds" | "minutes" | "hours" | "days" | "custom">("minutes")
  const [intervalSec, setIntervalSec] = useState(10)
  const [intervalMin, setIntervalMin] = useState(15)
  const [intervalHour, setIntervalHour] = useState(1)
  const [hourMinute, setHourMinute] = useState(0)
  const [intervalDay, setIntervalDay] = useState(1)
  const [dayHour, setDayHour] = useState(12)
  const [dayMinute, setDayMinute] = useState(0)
  const [customCron, setCustomCron] = useState("0 */15 * * * *")

  const generatedCron = useMemo(() => {
    switch (frequency) {
      case "seconds":
        return `*/${intervalSec} * * * * *`
      case "minutes":
        return `0 */${intervalMin} * * * *`
      case "hours":
        return `0 ${hourMinute} */${intervalHour} * * *`
      case "days":
        return `0 ${dayMinute} ${dayHour} */${intervalDay} * *`
      case "custom":
        return customCron
    }
  }, [frequency, intervalSec, intervalMin, intervalHour, hourMinute, intervalDay, dayHour, dayMinute, customCron])
  useEffect(() => {
    onExpressionChange?.(generatedCron)
  }, [generatedCron, onExpressionChange])

  const nextRuns = useMemo(() => {
    const runs: { time: Date; offset: string }[] = []
    const now = new Date()

    try {
      const parts = generatedCron.trim().split(/\s+/)
      const hasSeconds = parts.length === 6

      const interval = CronExpressionParser.parse(generatedCron, {
        currentDate: now,
        hasSeconds,
      })

      for (let i = 0; i < 5; i++) {
        const next = interval.next()
        const d = (next && typeof next.toDate === "function")
          ? next.toDate()
          : (next as any)?.value?.toDate() || new Date()
        
        const diffMs = d.getTime() - now.getTime()
        const diffSecs = Math.max(1, Math.round(diffMs / 1000))
        const diffMins = Math.floor(diffSecs / 60)
        
        let offset = ""
        if (diffSecs < 60) {
          offset = `+${diffSecs}s`
        } else if (diffMins < 60) {
          offset = `+${diffMins}m`
        } else {
          const hrs = Math.floor(diffMins / 60)
          const mins = diffMins % 60
          if (hrs < 24) {
            offset = mins === 0 ? `+${hrs}h` : `+${hrs}h ${mins}m`
          } else {
            const days = Math.floor(hrs / 24)
            const remHrs = hrs % 24
            offset = remHrs === 0 ? `+${days}d` : `+${days}d ${remHrs}h`
          }
        }
        
        runs.push({ time: d, offset })
      }
    } catch (err) {
      console.error("Cron parser error:", err)
    }
    return runs
  }, [generatedCron])

  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between lg:col-span-6", className)}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-text-primary">
            Cron Schedule Builder
          </h3>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-lg border border-border bg-canvas/30 p-1 mb-5">
          {(["seconds", "minutes", "hours", "days", "custom"] as const).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setFrequency(tab)}
              className={`flex-1 rounded-md py-1 text-center text-[11px] font-bold capitalize transition-all cursor-pointer ${
                frequency === tab
                  ? "bg-surface text-text-primary shadow-sm border border-border/40"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Builder Panel Fields */}
        <div className="min-h-[44px]">
          {frequency === "seconds" && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-secondary py-1">
              <span>Run job every</span>
              <select
                value={intervalSec}
                onChange={(e) => setIntervalSec(Number(e.target.value))}
                className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
              </select>
              <span>seconds.</span>
            </div>
          )}

          {frequency === "minutes" && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-secondary py-1">
              <span>Run job every</span>
              <select
                value={intervalMin}
                onChange={(e) => setIntervalMin(Number(e.target.value))}
                className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-sm"
              >
                <option value={1}>1</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
              </select>
              <span>minutes.</span>
            </div>
          )}

          {frequency === "hours" && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-secondary py-1">
              <span>Run job every</span>
              <select
                value={intervalHour}
                onChange={(e) => setIntervalHour(Number(e.target.value))}
                className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-sm"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
              </select>
              <span>hour(s) at minute</span>
              <select
                value={hourMinute}
                onChange={(e) => setHourMinute(Number(e.target.value))}
                className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-sm"
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const val = i * 5
                  return <option key={val} value={val}>{val}</option>
                })}
              </select>
              <span>.</span>
            </div>
          )}

          {frequency === "days" && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-text-secondary py-1">
              <span>Run job every</span>
              <select
                value={intervalDay}
                onChange={(e) => setIntervalDay(Number(e.target.value))}
                className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-sm"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={7}>7</option>
              </select>
              <span>day(s) at time</span>
              <select
                value={dayHour}
                onChange={(e) => setDayHour(Number(e.target.value))}
                className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-sm"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, "0")}</option>
                ))}
              </select>
              <span>:</span>
              <select
                value={dayMinute}
                onChange={(e) => setDayMinute(Number(e.target.value))}
                className="rounded-md border border-border bg-surface px-2 py-1 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-sm"
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const val = i * 5
                  return <option key={val} value={val}>{String(val).padStart(2, "0")}</option>
                })}
              </select>
              <span>.</span>
            </div>
          )}

          {frequency === "custom" && (
            <div className="py-1">
              <input
                type="text"
                value={customCron}
                onChange={(e) => setCustomCron(e.target.value)}
                placeholder="e.g. */10 14 * * 1-5"
                className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm transition-all"
              />
            </div>
          )}
        </div>

        <div className="space-y-4 py-2 border-t border-border/40 mt-5">
          <div className="flex items-center justify-between pb-1">
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Expression</span>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 tracking-wider">
                  {generatedCron}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(generatedCron)}
                  className="rounded-md p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-all cursor-pointer"
                  title="Copy Expression"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border/50 pt-5">
        <span className="text-[10px] font-bold text-text-muted uppercase block mb-8 tracking-wider">Schedule Timeline Projections</span>
        {nextRuns.length === 0 ? (
          <div className="text-center text-[10px] font-bold text-text-muted italic py-3 bg-surface-elevated/40 border border-border/40 rounded-lg">
            Waiting for a valid cron expression pattern...
          </div>
        ) : (
          <div className="relative flex items-center justify-between px-4 pb-2">
            <div className="absolute left-8 right-8 top-[6px] h-[2px] bg-border" />
            
            {nextRuns.map((run, idx) => {
              const clock = frequency === "seconds"
                ? run.time.toTimeString().split(" ")[0]
                : run.time.toTimeString().split(" ")[0].slice(0, 5)

              return (
                <div key={idx} className="relative z-10 flex flex-col items-center">
                  <div className="absolute -top-7 flex flex-col items-center">
                    <span className="rounded bg-accent text-canvas px-1.5 py-0.5 text-[9px] font-bold font-mono shadow-sm whitespace-nowrap">
                      {clock}
                    </span>
                    <div className="w-0 h-0 border-x-[3px] border-x-transparent border-t-[4px] border-t-accent" />
                  </div>
                  <div className="h-3 w-3 rounded-full bg-primary border-2 border-surface shadow-sm" />
                  <span className="text-[9px] font-bold text-text-muted mt-2">
                    {run.offset}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
