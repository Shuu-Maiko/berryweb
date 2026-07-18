import { useState, useMemo, useRef } from "react"
import { TrendingUp, Grid, MoreHorizontal } from "lucide-react"
import { executionHistoryData } from "./mockData"
import { cn } from "../../lib/utils"
import type { ExecutionData } from "./types"

export interface PerformanceChartProps {
  data?: ExecutionData[]
  title?: string
  subtitle?: string
  className?: string
}

export function PerformanceChart({
  data = executionHistoryData,
  title = "Scheduler performance",
  subtitle = "Runs, failed runs, duration",
  className,
}: PerformanceChartProps) {
  const [showTotalRuns, setShowTotalRuns] = useState(true)
  const [showFailedRuns, setShowFailedRuns] = useState(true)
  const [showAvgDuration, setShowAvgDuration] = useState(true)
  const [vsPreviousPeriod, setVsPreviousPeriod] = useState(false)
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null)
  const lineChartRef = useRef<SVGSVGElement>(null)

  const chartHeight = 180
  const chartWidth = 500
  const paddingX = 30
  const paddingY = 15
  const maxRuns = 250
  const minVal = 0

  const getCoordinates = (index: number, value: number, isDuration = false) => {
    const totalPoints = data.length
    const x = paddingX + (index / (totalPoints - 1)) * (chartWidth - paddingX * 2)
    const scaleMax = isDuration ? 1000 : maxRuns
    const y = chartHeight - paddingY - ((value - minVal) / (scaleMax - minVal)) * (chartHeight - paddingY * 2)
    return { x, y }
  }

  const totalRunsPath = useMemo(() => {
    return data.map((d, i) => {
      const { x, y } = getCoordinates(i, d.totalRuns)
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    }).join(" ")
  }, [data])

  const failedRunsPath = useMemo(() => {
    return data.map((d, i) => {
      const { x, y } = getCoordinates(i, d.failures * 10)
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    }).join(" ")
  }, [data])

  const durationPath = useMemo(() => {
    return data.map((d, i) => {
      const { x, y } = getCoordinates(i, d.duration, true)
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    }).join(" ")
  }, [data])

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!lineChartRef.current || data.length === 0) return
    const rect = lineChartRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const chartContentWidth = chartWidth - paddingX * 2
    const relativeX = mouseX - paddingX
    const percentage = Math.max(0, Math.min(1, relativeX / chartContentWidth))
    const index = Math.round(percentage * (data.length - 1))
    setHoveredDataIndex(index)
  }

  const defaultHoverIndex = data.length > 0 ? Math.min(9, data.length - 1) : null
  const activeHoverIndex = hoveredDataIndex !== null ? hoveredDataIndex : defaultHoverIndex

  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6 shadow-sm", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-sm font-bold text-text-primary">{title}</h3>
          <span className="text-[10px] text-text-muted">{subtitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded border border-border p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
            <TrendingUp className="h-3.5 w-3.5" />
          </button>
          <button className="rounded border border-border p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
            <Grid className="h-3.5 w-3.5" />
          </button>
          <button className="rounded p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative pt-2">
        <svg
          ref={lineChartRef}
          className="w-full overflow-visible"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredDataIndex(null)}
        >
          {Array.from({ length: 4 }).map((_, i) => {
            const yVal = paddingY + (i / 3) * (chartHeight - paddingY * 2)
            return (
              <line
                key={i}
                x1={paddingX}
                y1={yVal}
                x2={chartWidth - paddingX}
                y2={yVal}
                className="stroke-border stroke-dashed"
                strokeWidth={1}
                strokeDasharray="2,3"
              />
            )
          })}

          {showTotalRuns && data.length > 0 && (
            <path
              d={totalRunsPath}
              fill="none"
              stroke="#15a347"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {showFailedRuns && data.length > 0 && (
            <path
              d={failedRunsPath}
              fill="none"
              stroke="#ec4899"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {showAvgDuration && data.length > 0 && (
            <path
              d={durationPath}
              fill="none"
              stroke="#111111"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {activeHoverIndex !== null && data[activeHoverIndex] && (
            <>
              <line
                x1={getCoordinates(activeHoverIndex, 0).x}
                y1={paddingY}
                x2={getCoordinates(activeHoverIndex, 0).x}
                y2={chartHeight - paddingY}
                className="stroke-text-muted/40 stroke-dashed"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              {showTotalRuns && (
                <circle
                  cx={getCoordinates(activeHoverIndex, data[activeHoverIndex].totalRuns).x}
                  cy={getCoordinates(activeHoverIndex, data[activeHoverIndex].totalRuns).y}
                  r={4}
                  fill="#15a347"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              )}
              {showFailedRuns && (
                <circle
                  cx={getCoordinates(activeHoverIndex, data[activeHoverIndex].failures * 10).x}
                  cy={getCoordinates(activeHoverIndex, data[activeHoverIndex].failures * 10).y}
                  r={4}
                  fill="#ec4899"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              )}
              {showAvgDuration && (
                <circle
                  cx={getCoordinates(activeHoverIndex, data[activeHoverIndex].duration, true).x}
                  cy={getCoordinates(activeHoverIndex, data[activeHoverIndex].duration, true).y}
                  r={4}
                  fill="#111111"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              )}
            </>
          )}

          {data.map((d, i) => {
            if (i % 2 !== 0 && i !== data.length - 1) return null
            const { x } = getCoordinates(i, 0)
            return (
              <text
                key={i}
                x={x}
                y={chartHeight - 2}
                textAnchor="middle"
                className="fill-text-muted text-[8px] font-medium"
              >
                {d.time}
              </text>
            )
          })}
        </svg>

        {activeHoverIndex !== null && data[activeHoverIndex] && (
          <div 
            className="absolute pointer-events-none rounded-lg border border-border bg-surface p-3 shadow-lg flex flex-col gap-1.5 transition-all duration-150 animate-scale-in"
            style={{
              left: `${(getCoordinates(activeHoverIndex, 0).x / chartWidth) * 80 + 5}%`,
              top: "35px"
            }}
          >
            <span className="text-[10px] font-bold text-text-muted uppercase">
              TIME: {data[activeHoverIndex].time}
            </span>
            <div className="flex flex-col gap-1 text-[11px] font-medium">
              {showTotalRuns && (
                <div className="flex items-center justify-between gap-5">
                  <span className="flex items-center gap-1.5 text-text-secondary">
                    <span className="h-2 w-2 rounded bg-[#15a347]" /> Total Runs
                  </span>
                  <span className="font-bold text-text-primary">
                    {data[activeHoverIndex].totalRuns}
                  </span>
                </div>
              )}
              {showAvgDuration && (
                <div className="flex items-center justify-between gap-5">
                  <span className="flex items-center gap-1.5 text-text-secondary">
                    <span className="h-2 w-2 rounded bg-[#111111]" /> Avg Duration
                  </span>
                  <span className="font-bold text-text-primary">
                    {(data[activeHoverIndex].duration / 1000).toFixed(2)}s
                  </span>
                </div>
              )}
              {showFailedRuns && (
                <div className="flex items-center justify-between gap-5">
                  <span className="flex items-center gap-1.5 text-text-secondary">
                    <span className="h-2 w-2 rounded bg-[#ec4899]" /> Failed Runs
                  </span>
                  <span className="font-bold text-text-primary text-error">
                    {data[activeHoverIndex].failures}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border/50 pt-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showTotalRuns}
              onChange={(e) => setShowTotalRuns(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
            />
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-[#15a347]" />
              Total Runs
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showFailedRuns}
              onChange={(e) => setShowFailedRuns(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-[#ec4899]"
            />
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-[#ec4899]" />
              Failed Runs
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAvgDuration}
              onChange={(e) => setShowAvgDuration(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-text-primary"
            />
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded bg-[#111111]" />
              Avg Duration
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Vs. previous period</span>
          <button
            type="button"
            onClick={() => setVsPreviousPeriod(!vsPreviousPeriod)}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              vsPreviousPeriod ? "bg-primary" : "bg-border"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                vsPreviousPeriod ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
