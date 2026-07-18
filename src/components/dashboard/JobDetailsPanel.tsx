import { Play, Pause, Trash2, X } from "lucide-react"
import type { CronJobItem } from "./types"

interface JobDetailsPanelProps {
  job: CronJobItem | null
  isOpen: boolean
  onClose: () => void
  onTrigger: () => void
  onToggleStatus: () => void
}

export function JobDetailsPanel({ job, isOpen, onClose, onTrigger, onToggleStatus }: JobDetailsPanelProps) {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-surface border-l border-border transition-transform shadow-xl flex flex-col justify-between h-full">
          <div className="overflow-y-auto flex-1 p-6">
            <div className="flex items-center justify-between pb-5 border-b border-border/80">
              <div>
                <h2 className="text-sm font-bold text-text-primary font-heading uppercase tracking-wider">{job.name}</h2>
                <span className="text-[10px] text-text-muted font-mono">{job.schedule}</span>
              </div>
              <button onClick={onClose} className="rounded p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6 pt-6">
              {/* Status Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-3 bg-canvas/20">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Status</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold mt-1.5 ${
                    job.status === "Running" && "bg-blue-500/10 text-blue-500"
                  } ${
                    job.status === "Success" && "bg-emerald-500/10 text-emerald-500"
                  } ${
                    job.status === "Failed" && "bg-rose-500/10 text-rose-500"
                  } ${
                    job.status === "Paused" && "bg-neutral-500/10 text-neutral-400"
                  }`}>
                    <span className={`mr-1 h-1.5 w-1.5 rounded-full ${
                      job.status === "Running" && "bg-blue-500"
                    } ${
                      job.status === "Success" && "bg-emerald-500"
                    } ${
                      job.status === "Failed" && "bg-rose-500"
                    } ${
                      job.status === "Paused" && "bg-neutral-400"
                    }`} />
                    {job.status}
                  </span>
                </div>
                <div className="rounded-lg border border-border p-3 bg-canvas/20">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Avg Duration</span>
                  <span className="text-sm font-bold text-text-primary mt-1.5 block">{job.avgDuration}</span>
                </div>
              </div>

              {/* Execution details */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Run Intervals</h3>
                <div className="rounded-lg border border-border divide-y divide-border text-xs">
                  <div className="flex justify-between p-2.5">
                    <span className="text-text-muted font-medium">Last Executed</span>
                    <span className="text-text-secondary font-semibold">{job.lastRun}</span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span className="text-text-muted font-medium">Next Execution</span>
                    <span className="text-text-secondary font-semibold">{job.nextRun}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onTrigger}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer transition-all"
                  >
                    <Play className="h-3.5 w-3.5 text-text-muted" /> Trigger Now
                  </button>
                  <button
                    onClick={onToggleStatus}
                    className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer transition-all"
                  >
                    <Pause className="h-3.5 w-3.5 text-text-muted" /> {job.status === "Paused" ? "Resume Job" : "Pause Job"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/80 p-6 bg-canvas/30 flex items-center justify-between gap-3 shrink-0">
            <button className="flex h-9 items-center gap-1.5 rounded-lg border border-error/25 bg-surface hover:bg-error-bg text-error px-4 text-xs font-bold cursor-pointer transition-all">
              <Trash2 className="h-3.5 w-3.5" /> Delete Job
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-accent text-canvas px-4 py-2 text-xs font-bold cursor-pointer transition-all shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
