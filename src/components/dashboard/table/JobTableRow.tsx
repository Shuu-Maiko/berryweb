import { Terminal, Globe, MoreHorizontal, Info, Trash2 } from "lucide-react"
import { cn } from "../../../lib/utils"
import { getNextRun } from "../../../utils/cron.utils"
import { getRelativeTime } from "../../../utils/date.utils"
import { Dropdown } from "../../ui/Dropdown"
import type { Job } from "../../../types/job.types"

interface JobTableRowProps {
  job: Job
  index: number
  isSelected: boolean
  onToggle: () => void
  onInfo: (secureJobId: string) => void
  onDelete: (secureJobId: string) => void
}

export function JobTableRow({ job, index, isSelected, onToggle, onInfo, onDelete }: JobTableRowProps) {
  const uiStatus = job.lastRunStatus === "SUCCEEDED" ? "Success" : 
                   job.lastRunStatus === "FAILED" ? "Failed" : 
                   job.lastRunStatus === "RUNNING" ? "Running" :
                   (job.status ? (job.status === "INACTIVE" ? "Paused" : "Active") : (job.end ? "Paused" : "Active"))
  const displayCron = job.cronExpression
  const verticalAlign = index < 2 ? "bottom" : "top"

  return (
    <tr
      onClick={onToggle}
      className={cn(
        "transition-all duration-150 hover:bg-canvas/50 cursor-pointer",
        isSelected && "bg-primary/5 hover:bg-primary/8"
      )}
    >
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer transition-all"
        />
      </td>
      <td className="px-4 py-3 font-bold text-text-primary">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-all duration-300", 
            job.jobType === "WEBHOOK" ? "bg-info/10 text-info hover:scale-110" : "bg-primary/10 text-primary hover:scale-110"
          )}>
            {job.jobType === "WEBHOOK" ? <Globe className="h-3.5 w-3.5" /> : <Terminal className="h-3.5 w-3.5" />}
          </div>
          <div className="flex flex-col">
            <span className="truncate max-w-[150px]">{job.name}</span>
            {job.jobType === "WEBHOOK" ? (
              <span className="flex items-center gap-1 mt-0.5 select-all">
                <span className={cn(
                  "text-[8px] font-extrabold px-1 py-0.2 rounded font-mono border tracking-wider",
                  job.httpMethod === "GET" && "bg-success-bg text-success border-success/15",
                  job.httpMethod === "POST" && "bg-info-bg text-info border-info/15",
                  job.httpMethod === "DELETE" && "bg-error-bg text-error border-error/15",
                  !["GET", "POST", "DELETE"].includes(job.httpMethod || "") && "bg-warning-bg text-warning border-warning/15"
                )}>
                  {job.httpMethod || "POST"}
                </span>
                <span className="text-[9px] text-text-muted font-mono truncate max-w-[180px] font-medium tracking-tight">
                  {job.url}
                </span>
              </span>
            ) : (
              <span className="text-[10px] text-text-muted italic truncate max-w-[200px] mt-0.5 tracking-tight font-medium">
                "{job.message || "No log message configured"}"
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <code className="rounded bg-surface-elevated border border-border/60 px-2 py-0.5 text-[10px] font-mono text-text-primary font-medium tracking-tight">
          {displayCron}
        </code>
      </td>
      <td className="px-4 py-3 text-text-secondary font-semibold">
        {getRelativeTime(job.createdAt)}
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm border transition-all duration-200",
            uiStatus === "Success" && "bg-success-bg text-success border-success/15",
            uiStatus === "Failed" && "bg-error-bg text-error border-error/15",
            uiStatus === "Paused" && "bg-surface-elevated text-text-muted border-border/80",
            uiStatus === "Running" && "bg-success-bg text-success border-success/15 animate-pulse",
            uiStatus === "Active" && "bg-info-bg text-info border-info/15"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              uiStatus === "Success" && "bg-success",
              uiStatus === "Failed" && "bg-error",
              uiStatus === "Paused" && "bg-text-muted",
              uiStatus === "Running" && "bg-success",
              uiStatus === "Active" && "bg-info"
            )}
          />
          {uiStatus}
        </span>
      </td>
      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
        <Dropdown
          align="right"
          verticalAlign={verticalAlign}
          trigger={
            <button className="rounded p-1.5 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer transition-all duration-150 active:scale-90" title="Manage Job">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
          items={[
            {
              key: "details",
              label: "View Details",
              icon: <Info className="h-3.5 w-3.5" />,
              onClick: () => onInfo(job.id),
            },
            {
              key: "delete",
              label: "Delete Job",
              icon: <Trash2 className="h-3.5 w-3.5" />,
              danger: true,
              onClick: () => onDelete(job.id),
            },
          ]}
        />
      </td>
    </tr>
  )
}
