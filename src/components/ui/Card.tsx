import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "../../lib/utils"

type CardProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-md bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5", className)}
      {...props}
    >
      {children}
    </div>
  )
}

type StatCardProps = {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: { value: string; positive: boolean }
  className?: string
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-md bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-text-muted">{label}</p>
          <p className="font-heading text-2xl font-bold text-text-primary">{value}</p>
          {trend && (
            <p className={cn("text-xs font-medium", trend.positive ? "text-success" : "text-error")}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-text-secondary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
