import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

type Column<T> = {
  key: string
  header: string
  render?: (item: T) => ReactNode
  className?: string
  headerClassName?: string
}

type TableProps<T> = {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string | number
  className?: string
  emptyState?: ReactNode
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  className,
  emptyState,
}: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-md bg-surface", className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-4 py-3 text-xs font-semibold text-text-muted", col.headerClassName)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-text-muted">
                {emptyState || "No data"}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="transition-all duration-150 hover:bg-surface-elevated"
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-text-secondary", col.className)}>
                    {col.render ? col.render(item) : (item[col.key] as ReactNode) ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
