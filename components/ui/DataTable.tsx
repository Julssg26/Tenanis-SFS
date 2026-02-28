'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'
import clsx from 'clsx'

// Column is covariant on T via render — keeping it generic for call-site type safety
// but the component itself accepts Column<unknown>[] internally to avoid contravariance issues.
export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

// Internal column type that erases T so the component doesn't need a constrained generic
interface AnyColumn {
  key: string
  header: string
  render?: (row: unknown) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchPlaceholder?: string
  searchKeys?: string[]
  pageSize?: number
  buttonLabel?: string
}

// The component signature uses T without constraints — data and columns stay in sync,
// and internally we treat rows as unknown (safe because columns own the render fns).
export default function DataTable<T>({
  columns,
  data,
  searchPlaceholder = 'Search',
  searchKeys = [],
  pageSize = 7,
  buttonLabel = 'Clean Search',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [page, setPage]   = useState(1)

  // Cast once here — safe because render() is defined per-column and already typed
  const cols = columns as AnyColumn[]
  const rows = data as unknown[]

  const filtered = query
    ? rows.filter(row =>
        searchKeys.some(k =>
          String((row as Record<string, unknown>)[k] ?? '').toLowerCase().includes(query.toLowerCase())
        )
      )
    : rows

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search bar */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            placeholder={searchPlaceholder}
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-[13px] outline-none focus:border-[#1a237e]"
          />
        </div>
        <button
          onClick={() => { setQuery(''); setPage(1) }}
          className="bg-[#1a237e] text-white text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-[#283593] transition-colors whitespace-nowrap"
        >
          {buttonLabel}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1a237e]">
              {cols.map(col => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 text-[12px] font-semibold text-white',
                    col.align === 'right'  ? 'text-right'  :
                    col.align === 'center' ? 'text-center' : 'text-left'
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, ri) => (
              <tr key={ri} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                {cols.map(col => (
                  <td
                    key={col.key}
                    className={clsx(
                      'px-4 py-3 text-[13px] text-gray-700',
                      col.align === 'right'  ? 'text-right'  :
                      col.align === 'center' ? 'text-center' : 'text-left'
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 text-[12px] text-gray-600">
        <span className="mr-2">Elementos por página:</span>
        <span className="border border-gray-200 rounded px-2 py-1">{pageSize}</span>
        <span className="mx-3">
          {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} de {filtered.length}
        </span>
        <button onClick={() => setPage(1)} disabled={page === 1} className="disabled:opacity-30 hover:text-[#1a237e]">
          <ChevronsLeft size={15} />
        </button>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="disabled:opacity-30 hover:text-[#1a237e]">
          <ChevronLeft size={15} />
        </button>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="disabled:opacity-30 hover:text-[#1a237e]">
          <ChevronRight size={15} />
        </button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="disabled:opacity-30 hover:text-[#1a237e]">
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  )
}
