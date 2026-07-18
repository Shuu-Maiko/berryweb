import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "../../lib/utils"

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:brightness-90",
  secondary:
    "bg-surface text-text-secondary border border-border hover:bg-surface-elevated hover:text-text-primary",
  ghost:
    "text-text-muted hover:text-text-primary hover:bg-surface-elevated",
  danger:
    "bg-error text-white hover:brightness-110",
}

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
}

type ButtonProps = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
          "hover:-translate-y-px active:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="h-3.5 w-3.5 animate-spin-slow" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"
