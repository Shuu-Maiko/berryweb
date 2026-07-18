import { useState, useMemo, useEffect } from "react"
import { Search, ChevronDown, ChevronLeft, ChevronRight, Terminal, MoreHorizontal } from "lucide-react"
import { mockCronJobs } from "./mockData"
import { cn } from "../../lib/utils"
import type { CronJobItem } from "./types"

export interface JobsTableProps {
  jobs?: CronJobItem[]
  onSelectJob?: (job: CronJobItem) => void
  className?: string
}

export function JobsTable({
  jobs = mockCronJobs,
  onSelectJob,
  className,
}: JobsTableProps) {
  const [tableTab, setTableTab] = useState<"All" | "Failing" | "Paused" | "Success">("Failing")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      let matchesTab = false
      if (tableTab === "All") matchesTab = true
      else if (tableTab === "Failing") matchesTab = job.status === "Failed"
      else if (tableTab === "Paused") matchesTab = job.status === "Paused"
      else if (tableTab === "Success") matchesTab = job.status === "Success" || job.status === "Running"

      const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.schedule.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [jobs, tableTab, searchQuery])

  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredJobs.slice(startIndex, startIndex + pageSize)
  }, [filteredJobs, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [tableTab, searchQuery])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedJobIds(paginatedJobs.map(job => job.id))
    } else {
      setSelectedJobIds([])
    }
  }

  const handleSelectRow = (id: string) => {
    setSelectedJobIds(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  return (
    <div className={cn("rounded-xl border border-border bg-surface shadow-sm overflow-hidden", className)}>
      <div className="flex flex-col gap-4 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["All", "Failing", "Paused", "Success"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTableTab(tab)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer",
                tableTab === tab
                  ? "bg-surface-elevated text-text-primary shadow-sm"
                  : "text-text-secondary/70 hover:bg-surface-elevated hover:text-text-primary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-44 rounded-lg border border-border bg-surface pl-8 pr-3 text-xs text-text-primary placeholder-text-muted transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-text-muted bg-surface-elevated px-1 rounded border border-border pointer-events-none">
            ⌘F
          </span>
        </div>
      </div>

      {/* Cron Jobs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-canvas/30">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={paginatedJobs.length > 0 && paginatedJobs.every(job => selectedJobIds.includes(job.id))}
                  className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Job Name</th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Schedule</th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Last Run</th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Next Run</th>
              <th className="px-4 py-3 font-semibold text-text-secondary">Status</th>
              <th className="px-4 py-3 font-semibold text-text-secondary text-right">Avg Duration</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-text-muted font-medium">
                  No matching cron jobs found
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job) => {
                const isSelected = selectedJobIds.includes(job.id)
                return (
                  <tr
                    key={job.id}
                    onClick={() => onSelectJob?.(job)}
                    className={cn(
                      "transition-colors duration-100 hover:bg-canvas/40 cursor-pointer",
                      isSelected && "bg-primary/5 hover:bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(job.id)}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-2.5 font-bold text-text-primary flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                        <Terminal className="h-3.5 w-3.5" />
                      </div>
                      <span className="truncate max-w-[150px]">{job.name}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <code className="rounded bg-surface-elevated border border-border/60 px-1.5 py-0.5 text-[10px] font-mono text-text-primary font-medium">
                        {job.schedule}
                      </code>
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary font-semibold">{job.lastRun}</td>
                    <td className="px-4 py-2.5 text-text-muted font-medium">{job.nextRun}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm",
                          job.status === "Success" && "bg-success-bg text-success border border-success/15",
                          job.status === "Failed" && "bg-error-bg text-error border border-error/15",
                          job.status === "Paused" && "bg-surface-elevated text-text-muted border border-border",
                          job.status === "Running" && "bg-success-bg text-success border border-success/15 animate-pulse"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1 w-1 rounded-full",
                            job.status === "Success" && "bg-success",
                            job.status === "Failed" && "bg-error",
                            job.status === "Paused" && "bg-text-muted",
                            job.status === "Running" && "bg-success"
                          )}
                        />
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-text-primary">
                      {job.avgDuration}
                    </td>
                    <td className="px-4 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button className="rounded p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary cursor-pointer">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-border/60 bg-canvas/30 px-4 py-3">
        <div className="flex items-center gap-1 text-[11px] text-text-secondary font-semibold">
          <span>Show by</span>
          <div className="flex items-center gap-1 rounded border border-border bg-surface px-2 py-1 hover:bg-surface-elevated cursor-pointer">
            <span>{pageSize}</span>
            <ChevronDown className="h-3 w-3 text-text-muted" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-text-secondary font-semibold">
            {currentPage} <span className="text-text-muted">/</span> {totalPages || 1}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-surface text-text-secondary hover:bg-surface-elevated disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-surface text-text-secondary hover:bg-surface-elevated disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
