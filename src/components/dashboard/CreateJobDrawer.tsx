import { useState } from "react"
import { X, Save } from "lucide-react"

interface CreateJobDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSave: (job: { name: string; schedule: string; status: string }) => void
}

export function CreateJobDrawer({ isOpen, onClose, onSave }: CreateJobDrawerProps) {
  const [name, setName] = useState("")
  const [schedule, setSchedule] = useState("*/15 * * * *")
  const [endpoint, setEndpoint] = useState("https://api.sypher.com/jobs/run")
  const [concurrency, setConcurrency] = useState(1)
  const [alertOnFailure, setAlertOnFailure] = useState(true)

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    onSave({
      name,
      schedule,
      status: "Success",
    })
    setName("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-surface border-l border-border transition-transform shadow-xl flex flex-col justify-between h-full">
          <div className="overflow-y-auto flex-1 p-6">
            <div className="flex items-center justify-between pb-5 border-b border-border/80">
              <h2 className="text-sm font-bold text-text-primary font-heading uppercase tracking-wider">Create Cron Job</h2>
              <button onClick={onClose} className="rounded p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 pt-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Job Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. db-cleaner"
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Target Endpoint URL</label>
                <input
                  type="url"
                  required
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="https://api.yourdomain.com/v1/task"
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Cron Schedule Expression</label>
                <input
                  type="text"
                  required
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="e.g. */5 * * * *"
                  className="h-9 w-full rounded-md border border-border bg-surface px-3 text-xs font-mono text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Max Concurrency Limit ({concurrency})</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={concurrency}
                  onChange={(e) => setConcurrency(Number(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={alertOnFailure}
                    onChange={(e) => setAlertOnFailure(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border text-primary accent-primary animate-pulse"
                  />
                  <span>Notify developers on execution failure</span>
                </label>
              </div>
            </form>
          </div>

          <div className="border-t border-border/80 p-6 bg-canvas/30 flex items-center justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="rounded-md border border-border bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary px-4 py-2 text-xs font-bold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white px-4 py-2 text-xs font-bold cursor-pointer transition-all shadow-sm"
            >
              <Save className="h-3.5 w-3.5" /> Save Job
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
