import { ChevronLeft, ChevronRight } from "lucide-react"

interface JobTablePaginationProps {
  currentPage: number
  setCurrentPage: (updater: number | ((prev: number) => number)) => void
  totalPages: number
}

export function JobTablePagination({
  currentPage,
  setCurrentPage,
  totalPages,
}: JobTablePaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-border/60 bg-canvas/30 px-4 py-3">
      <div className="flex items-center gap-1 text-[11px] text-text-secondary font-semibold">
        <span>Show by 10</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-text-secondary font-semibold">
          {currentPage} <span className="text-text-muted">/</span> {totalPages || 1}
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="flex h-7 w-7 items-center justify-center rounded border border-border bg-surface text-text-secondary hover:bg-surface-elevated disabled:pointer-events-none disabled:opacity-40 cursor-pointer transition-all duration-150 active:scale-95"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="flex h-7 w-7 items-center justify-center rounded border border-border bg-surface text-text-secondary hover:bg-surface-elevated disabled:pointer-events-none disabled:opacity-40 cursor-pointer transition-all duration-150 active:scale-95"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
