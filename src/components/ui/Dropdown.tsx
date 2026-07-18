import { useState, useRef, useEffect, type ReactNode } from "react"
import { cn } from "../../lib/utils"

type DropdownItem = {
  key: string
  label: string
  icon?: ReactNode
  danger?: boolean
  onClick: () => void
}

type DropdownProps = {
  trigger: ReactNode
  items: DropdownItem[]
  align?: "left" | "right"
  verticalAlign?: "top" | "bottom"
  className?: string
}

export function Dropdown({ trigger, items, align = "right", verticalAlign = "bottom", className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-40 min-w-[160px] overflow-hidden rounded-md border border-border bg-surface py-1 shadow-md animate-scale-in",
            align === "right" ? "right-0" : "left-0",
            verticalAlign === "top" ? "bottom-full mb-1" : "top-full mt-1",
          )}
        >
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                item.danger
                  ? "text-error hover:bg-error-bg"
                  : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary",
              )}
            >
              {item.icon && <span className="h-4 w-4">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
