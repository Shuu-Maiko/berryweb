import { useState, useEffect, type ReactNode } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { cn } from "../../lib/utils"

type AppShellProps = {
  children: ReactNode
  currentTab?: string
  onTabSelect?: (tabName: string) => void
}

export function AppShell({ children, currentTab = "Dashboard", onTabSelect = () => {} }: AppShellProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-canvas text-text-secondary flex">
      {/* Sidebar on the Left */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentTab={currentTab}
        onTabSelect={onTabSelect}
      />

      {/* Main Content Area on the Right */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-200",
        sidebarCollapsed ? "pl-16" : "pl-56"
      )}>
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onTabSelect={onTabSelect}
        />
        <main className="flex-1">
          <div className="animate-fade-in px-4 py-6 md:px-8 max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
