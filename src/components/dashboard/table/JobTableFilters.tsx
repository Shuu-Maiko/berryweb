import { Search } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { TableTab } from "../../../hooks/useTableState"

interface JobTableFiltersProps {
  tableTab: TableTab
  setTableTab: (tab: TableTab) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function JobTableFilters({
  tableTab,
  setTableTab,
  searchQuery,
  setSearchQuery,
}: JobTableFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between bg-surface/50 backdrop-blur-md">
      {/* Tab Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {(["All", "Active", "Paused", "Webhooks", "Logs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setTableTab(tab)}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95",
              tableTab === tab
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-48 rounded-lg border border-border bg-surface pl-9 pr-3 text-xs text-text-primary placeholder-text-muted transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
      </div>
    </div>
  )
}
