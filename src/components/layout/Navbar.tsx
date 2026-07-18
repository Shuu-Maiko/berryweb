import { Moon, Sun, FileText } from "lucide-react"
import { cn } from "../../lib/utils"
import { Dropdown } from "../ui/Dropdown"
import { Logo } from "../ui/Logo"
import { useState } from "react"
import { authService } from "../../services/auth.service"

type NavbarProps = {
  darkMode?: boolean
  onToggleDarkMode?: () => void
  onTabSelect?: (tabName: string) => void
}

export function Navbar({ darkMode, onToggleDarkMode, onTabSelect }: NavbarProps) {
  const [activeNav, setActiveNav] = useState("Dashboard")
  
  const navItems = [
    "Dashboard",
    "Cron Jobs",
    "Executions",
    "Metrics",
    "Schedules",
    "Alerts",
    "Settings"
  ]

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-border bg-surface px-6 md:px-8 backdrop-blur-sm">
      {/* Left side: Section Label */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-text-muted">
          Overview
        </span>
      </div>

      {/* Right side: Actions & User profile */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggler */}
        <button
          onClick={onToggleDarkMode}
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-all duration-150 hover:bg-surface-elevated hover:text-text-primary cursor-pointer"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
        </button>

        {/* Generate Report Button */}
        <button className="hidden md:flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-medium text-text-secondary transition-all duration-150 hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
          <FileText className="h-3.5 w-3.5 text-text-muted" strokeWidth={2} />
          <span>Generate Report</span>
        </button>

        {/* Dedicated Logout Button */}
        <button 
          onClick={() => authService.logout()}
          className="flex h-8 items-center gap-1.5 rounded-md bg-error/10 hover:bg-error/20 border border-error/20 px-3 text-xs font-bold text-error transition-all duration-150 cursor-pointer"
        >
          <span>Log out</span>
        </button>

        <div className="h-4 w-px bg-border hidden sm:block" />

        {/* User profile dropdown */}
        <Dropdown
          trigger={
            <div className="flex cursor-pointer items-center gap-2 rounded-md py-1 transition-all duration-150 hover:opacity-85">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="User Profile"
                className="h-6 w-6 rounded-full object-cover border border-border"
              />
            </div>
          }
          items={[
            { key: "profile", label: "Profile Settings", onClick: () => onTabSelect?.("Settings") },
            { key: "organization", label: "Sypher Org", onClick: () => {} },
            { key: "billing", label: "Billing", onClick: () => {} },
            { key: "logout", label: "Sign out", danger: true, onClick: authService.logout },
          ]}
        />
      </div>
    </header>
  );
}
