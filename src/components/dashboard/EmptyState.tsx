import { Terminal, Plus } from "lucide-react"

interface EmptyStateProps {
  onCreateClick: () => void
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-16 text-center shadow-sm max-w-2xl mx-auto flex flex-col items-center justify-center space-y-4 animate-fade-in font-sans">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-md border border-primary/10">
        <Terminal className="h-8 w-8" strokeWidth={2} />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wider">
          No Active Scheduled Jobs
        </h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
          Automate task scheduling by setting up trigger invocations for your endpoints. Create your first job configuration to begin monitoring active cron runners.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white px-4 py-2 text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Schedule First Job</span>
      </button>
    </div>
  )
}
