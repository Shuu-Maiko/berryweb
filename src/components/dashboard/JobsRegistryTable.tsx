import { useTableState } from "../../hooks/useTableState"
import { JobTableFilters } from "./table/JobTableFilters"
import { JobTableRow } from "./table/JobTableRow"
import { JobTablePagination } from "./table/JobTablePagination"
import type { Job } from "../../types/job.types"

interface JobsRegistryTableProps {
  jobs: Job[]
  onDelete: (secureJobId: string) => void
  onInfo: (secureJobId: string) => void
}

export function JobsRegistryTable({ jobs, onDelete, onInfo }: JobsRegistryTableProps) {
  const {
    tableTab,
    setTableTab,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedJobs,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    isAllSelected,
  } = useTableState({ jobs })

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden animate-fade-in font-sans">
      <JobTableFilters
        tableTab={tableTab}
        setTableTab={setTableTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-canvas/30 text-text-secondary/80 font-medium">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={isAllSelected}
                  className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer transition-all"
                />
              </th>
              <th className="px-4 py-3 font-semibold">Job Name</th>
              <th className="px-4 py-3 font-semibold">Schedule</th>
              <th className="px-4 py-3 font-semibold">Created At</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-muted font-medium bg-canvas/10">
                  No matching jobs found
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job, index) => (
                <JobTableRow
                  key={job.id}
                  job={job}
                  index={index}
                  isSelected={selectedIds.includes(job.id)}
                  onToggle={() => toggleSelect(job.id)}
                  onInfo={onInfo}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <JobTablePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  )
}
