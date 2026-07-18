import { cn } from "../../lib/utils"
import {
  LayoutDashboard,
  Timer,
  History,
  Settings,
  BarChart3,
  Clock,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Logo } from "../ui/Logo"

type NavItem = {
  label: string
  icon: React.ReactNode
  href: string
  active?: boolean
  badge?: string | number
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" strokeWidth={2.5} />, href: "#", active: true },
  { label: "Settings", icon: <Settings className="h-4 w-4" strokeWidth={2.5} />, href: "#" },
]

type SidebarProps = {
  collapsed?: boolean
  onToggle?: () => void
  currentTab: string
  onTabSelect: (tabName: string) => void
}

export function Sidebar({ collapsed: controlledCollapsed, onToggle, currentTab, onTabSelect }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = controlledCollapsed ?? internalCollapsed

  const toggle = () => {
    if (onToggle) onToggle()
    else setInternalCollapsed(!collapsed)
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col bg-sidebar transition-all duration-200",
        collapsed ? "w-16" : "w-56",
      )}
    >
      <div className={cn("flex h-14 items-center", collapsed ? "justify-center" : "px-5")}>
        <Logo showText={!collapsed} />
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.label
          return (
            <button
              key={item.label}
              onClick={() => onTabSelect(item.label)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-sidebar-active text-primary"
                  : "text-text-secondary hover:bg-sidebar-hover hover:text-text-primary",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          )
        })}
      </nav>

      <div className={cn("p-2", collapsed && "flex justify-center")}>
        <button
          onClick={toggle}
          className={cn(
            "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs text-text-muted transition-all duration-150 hover:bg-sidebar-hover hover:text-text-primary w-full",
            collapsed && "px-2",
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" strokeWidth={2.5} /> : <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  )
}
