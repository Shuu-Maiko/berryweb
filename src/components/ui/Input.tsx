import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "../../lib/utils"

type InputProps = {
  label?: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "h-9 w-full rounded-md border bg-surface px-3 text-sm text-text-primary placeholder-text-muted transition-all duration-200",
            "border-border hover:border-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15",
            "file:mr-3 file:rounded file:border-0 file:bg-surface-elevated file:px-2 file:py-0.5 file:text-xs file:font-medium file:text-text-secondary",
            error && "border-error/50 focus:border-error focus:ring-error/15",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    )
  },
)
Input.displayName = "Input"
