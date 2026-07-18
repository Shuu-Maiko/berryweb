import { useState, useMemo, useEffect } from "react"
import type { Job } from "../types/job.types"

export type TableTab = "All" | "Active" | "Paused" | "Webhooks" | "Logs"

interface UseTableStateOptions {
  jobs: Job[]
  pageSize?: number
}

export function useTableState({ jobs, pageSize = 10 }: UseTableStateOptions) {
  const [tableTab, setTableTab] = useState<TableTab>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Reset pagination when searching or changing tabs
  useEffect(() => {
    setCurrentPage(1)
  }, [tableTab, searchQuery])

  // Filter Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Determine tab match
      let matchesTab = false

      if (tableTab === "All") matchesTab = true
      else if (tableTab === "Active") matchesTab = job.status ? (job.status === "ACTIVE") : !job.end
      else if (tableTab === "Paused") matchesTab = job.status ? (job.status === "INACTIVE") : !!job.end
      else if (tableTab === "Webhooks") matchesTab = job.jobType === "WEBHOOK"
      else if (tableTab === "Logs") matchesTab = job.jobType === "PRINT_LOG"

      // Determine search match
      const cronToSearch = job.cronExpression || ""
      const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            cronToSearch.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesTab && matchesSearch
    })
  }, [jobs, tableTab, searchQuery])

  // Paginate Jobs
  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredJobs.slice(startIndex, startIndex + pageSize)
  }, [filteredJobs, currentPage, pageSize])

  // Selection state helpers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    const paginatedIds = paginatedJobs.map((j) => j.id)
    const allSelected = paginatedIds.length > 0 && paginatedIds.every((id) => selectedIds.includes(id))

    if (allSelected) {
      // Remove all visible on current page from selection
      setSelectedIds((prev) => prev.filter((id) => !paginatedIds.includes(id)))
    } else {
      // Add all visible on current page to selection (prevent duplicates)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedIds])))
    }
  }

  const isAllSelected = paginatedJobs.length > 0 && paginatedJobs.every((j) => selectedIds.includes(j.id))

  return {
    tableTab,
    setTableTab,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedJobs,
    filteredJobsCount: filteredJobs.length,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    isAllSelected,
    clearSelection: () => setSelectedIds([]),
  }
}
