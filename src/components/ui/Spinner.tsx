import { cn } from "../../lib/utils"

interface SpinnerProps {
  className?: string
  size?: "xs" | "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    xs: "h-3.5 w-3.5 border-2",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-border border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  )
}
