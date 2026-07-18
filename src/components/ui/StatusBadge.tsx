import { cn } from "../../lib/utils"

export type JobStatus = "running" | "success" | "failed" | "pending" | "paused"

const statusConfig: Record<JobStatus, { dot: string; text: string; bg: string }> = {
  running: {
    dot: "bg-primary animate-pulse-dot",
    text: "text-primary",
    bg: "bg-primary/10",
  },
  success: {
    dot: "bg-success",
    text: "text-success",
    bg: "bg-success/10",
  },
  failed: {
    dot: "bg-error",
    text: "text-error",
    bg: "bg-error/10",
  },
  pending: {
    dot: "bg-warning",
    text: "text-warning",
    bg: "bg-warning/10",
  },
  paused: {
    dot: "bg-text-muted",
    text: "text-text-muted",
    bg: "bg-surface-elevated",
  },
}

type StatusBadgeProps = {
  status: JobStatus
  size?: "sm" | "md"
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status]
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-medium capitalize",
        size === "sm" ? "text-[11px]" : "text-xs",
        config.bg,
        config.text,
      )}
    >
      <span className={cn("rounded-full", dotSize, config.dot)} />
      {status}
    </span>
  )
}
