'use client'

import { useState } from 'react'
import { Settings2, User, TrendingUp, ArrowRight, Search } from 'lucide-react'
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import EquipmentRanking from '@/components/performance/EquipmentRanking'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import type { Column } from '@/components/ui/DataTable'
import { EQUIPMENT_PERF, OPERATORS } from '@/lib/mock-data'
import type { EquipmentPerf } from '@/lib/types'
import clsx from 'clsx'

// ─── Tabs config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'equipment', label: 'Equipment Performance', Icon: Settings2 },
  { id: 'operator',  label: 'Operator Performance',  Icon: User      },
  { id: 'flow',      label: 'Flow Analysis',          Icon: TrendingUp },
]

// ─── Equipment tab helpers ────────────────────────────────────────────────────
function getIdleBadge(idle: number) {
  if (idle <= 18) return <Badge label={`${idle} %`} color="green" />
  if (idle <= 25) return <Badge label={`${idle} %`} color="orange" />
  return <Badge label={`${idle} %`} color="red" />
}
function getEffBadge(eff: number) {
  if (eff >= 80) return <Badge label={`${eff} %`} color="green" />
  return <Badge label={`${eff} %`} color="orange" />
}
const EQUIP_COLS: Column<EquipmentPerf>[] = [
  { key: 'id',         header: 'Operator'                                                          },
  { key: 'onHours',    header: 'On Hours',   render: r => `${r.onHours} h`                        },
  { key: 'effective',  header: 'Effective',  render: r => `${r.effective} h`                      },
  { key: 'idle',       header: 'Idle',       render: r => getIdleBadge(r.idle),  align: 'center'  },
  { key: 'cycles',     header: 'Cycles'                                                            },
  { key: 'efficiency', header: 'Efficiency', render: r => getEffBadge(r.efficiency), align: 'center' },
]

// ─── Operator Performance tab ─────────────────────────────────────────────────
// Derived data for this tab from existing OPERATORS mock
const OPERATOR_PERF_DATA = OPERATORS.map(op => ({
  operator:        op.name,
  routeCompliance: op.compliance,
  effectivePct:    Math.round(op.compliance * 0.93),   // derived approximation
  incidents:       op.incidents,
  score:           op.score,
}))

type OpPerfRow = typeof OPERATOR_PERF_DATA[number]

function IncidentBadge({ n }: { n: number }) {
  return (
    <span className={clsx(
      'inline-flex items-center justify-center w-8 h-7 rounded-full text-[13px] font-bold text-white',
      n === 0 ? 'bg-green-600' : n === 1 ? 'bg-red-500' : 'bg-red-600'
    )}>
      {n}
    </span>
  )
}
function ScorePill({ s }: { s: number }) {
  const bg = s >= 90 ? 'bg-green-600' : s >= 80 ? 'bg-green-500' : s >= 70 ? 'bg-yellow-400' : 'bg-red-500'
  return (
    <span className={clsx(
      'inline-flex items-center justify-center px-4 py-1 rounded-full text-[13px] font-bold text-white min-w-[52px]',
      bg
    )}>
      {s}
    </span>
  )
}

function OperatorPerfTab() {
  const [query, setQuery]   = useState('')
  const [page, setPage]     = useState(1)
  const PAGE_SIZE           = 5

  const filtered = query
    ? OPERATOR_PERF_DATA.filter(r =>
        r.operator.toLowerCase().includes(query.toLowerCase())
      )
    : OPERATOR_PERF_DATA

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clear = () => { setQuery(''); setPage(1) }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search row */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            placeholder="Buscar"
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-[13px] outline-none focus:border-[#1a237e]"
          />
        </div>
        <button
          onClick={clear}
          className="bg-[#1a237e] text-white text-[13px] font-medium px-5 py-2 rounded-lg hover:bg-[#283593] transition-colors whitespace-nowrap"
        >
          Limpiar Búsqueda
        </button>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-[#1a237e]">
            {['Operator','Route Compliance','Effective %','Incidents','Score'].map(h => (
              <th key={h} className="px-5 py-3 text-[12px] font-semibold text-white text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3 text-[13px] text-gray-700">{row.operator}</td>
              <td className="px-5 py-3 text-[13px] text-gray-700">{row.routeCompliance} %</td>
              <td className="px-5 py-3 text-[13px] text-gray-700">{row.effectivePct} %</td>
              <td className="px-5 py-3"><IncidentBadge n={row.incidents} /></td>
              <td className="px-5 py-3"><ScorePill s={row.score} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 text-[12px] text-gray-600">
        <span>Elementos por página:</span>
        <span className="border border-gray-200 rounded px-2 py-1">{PAGE_SIZE}</span>
        <span className="mx-3">
          {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} de {filtered.length}
        </span>
        <button onClick={() => setPage(1)}          disabled={page===1}          className="disabled:opacity-30 hover:text-[#1a237e]"><ChevronsLeft size={15}/></button>
        <button onClick={() => setPage(p=>p-1)}     disabled={page===1}          className="disabled:opacity-30 hover:text-[#1a237e]"><ChevronLeft  size={15}/></button>
        <button onClick={() => setPage(p=>p+1)}     disabled={page===totalPages} className="disabled:opacity-30 hover:text-[#1a237e]"><ChevronRight size={15}/></button>
        <button onClick={() => setPage(totalPages)} disabled={page===totalPages} className="disabled:opacity-30 hover:text-[#1a237e]"><ChevronsRight size={15}/></button>
      </div>
    </div>
  )
}

// ─── Flow Analysis tab ────────────────────────────────────────────────────────
const FLOW_ROUTES = [
  { from: 'Blue Yard',  to: 'MOTU',       trips: 87, avgMin: 18 },
  { from: 'Storage A',  to: 'Dispatch',   trips: 72, avgMin: 22 },
  { from: 'Inspection', to: 'Green Yard', trips: 64, avgMin: 15 },
  { from: 'MOTU',       to: 'Dispatch',   trips: 58, avgMin: 25 },
  { from: 'Green Yard', to: 'Storage A',  trips: 45, avgMin: 12 },
]

function FlowAnalysisTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-5">
      <div className="text-[15px] font-semibold text-gray-800 mb-1">Most Frequent Routes</div>
      <div className="text-[12px] text-gray-500 mb-4">Top origin-destination pairs by trip count</div>

      <div className="space-y-2">
        {FLOW_ROUTES.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            {/* Route label */}
            <div className="flex items-center gap-2 text-[14px] font-medium text-gray-700">
              {r.from}
              <ArrowRight size={13} className="text-gray-400" />
              {r.to}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <span className="text-[14px] font-bold text-green-600">{r.trips} trips</span>
              <span className="text-[14px] text-gray-500">{r.avgMin} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState('equipment')

  return (
    <div>
      <SectionHeader
        title="Performance Analytics"
        subtitle="Deep operational analysis and benchmarking"
      />

      {/* Tabs bar */}
      <div className="flex border-b border-gray-200 mb-5 bg-white rounded-t-xl px-4 pt-3 shadow-sm border border-gray-100">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors mr-1',
              activeTab === id
                ? 'border-[#1a237e] text-[#1a237e]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'equipment' && (
        <>
          <EquipmentRanking />
          <DataTable
            columns={EQUIP_COLS}
            data={EQUIPMENT_PERF}
            searchPlaceholder="Buscar"
            searchKeys={['id']}
            buttonLabel="Limpiar Búsqueda"
          />
        </>
      )}

      {activeTab === 'operator' && <OperatorPerfTab />}
      {activeTab === 'flow'     && <FlowAnalysisTab />}
    </div>
  )
}
