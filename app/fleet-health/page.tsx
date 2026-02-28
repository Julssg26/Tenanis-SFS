'use client'

import SectionHeader from '@/components/ui/SectionHeader'
import KpiCard from '@/components/ui/KpiCard'
import DataTable from '@/components/ui/DataTable'
import { RiskBadge } from '@/components/ui/Badge'
import { ScoreBar } from '@/components/ui/ProgressBar'
import { Clock } from 'lucide-react'
import type { Column } from '@/components/ui/DataTable'
import { FLEET_UNITS } from '@/lib/mock-data'
import type { FleetUnit } from '@/lib/types'

const HEALTH_KPIS = [
  { value: '4',    label: 'Healthy Units',    subLabel: '', iconBg: 'bg-green-500',  icon: 'CheckCircle2' },
  { value: '2',    label: 'Warning',          subLabel: '', iconBg: 'bg-yellow-400', icon: 'AlertTriangle' },
  { value: '2',    label: 'Critical',         subLabel: '', iconBg: 'bg-red-500',    icon: 'Wrench' },
  { value: '91 %', label: 'Maint. Compliance',subLabel: '', iconBg: 'bg-blue-600',   icon: 'TrendingUp' },
]

// Wear index circle
function WearCircle({ value }: { value: number }) {
  const color = value <= 30 ? '#16a34a' : value <= 60 ? '#eab308' : '#ef4444'
  return (
    <div
      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold"
      style={{ borderColor: color, color }}
    >
      {value}
    </div>
  )
}

const COLUMNS: Column<FleetUnit>[] = [
  { key: 'id',           header: 'Unit'                                                                                           },
  { key: 'engineHours',  header: 'Engine Hours',  render: r => `${r.engineHours} h`                                              },
  { key: 'idleAccum',    header: 'Iddle Accum.',  render: r => `${r.idleAccum} h`                                                },
  { key: 'balanceScore', header: 'Balance Score', render: r => <ScoreBar value={r.balanceScore} />, align: 'left'                 },
  { key: 'wearIndex',    header: 'Wear Index',    render: r => <WearCircle value={r.wearIndex} />, align: 'center'               },
  { key: 'riskLevel',    header: 'Risk Level',    render: r => <RiskBadge level={r.riskLevel} />, align: 'center'                },
  { key: 'nextService',  header: 'Cycles',        render: r => (
    <span className="flex items-center gap-1 text-[12px] text-gray-600">
      <Clock size={11} /> {r.nextService}
    </span>
  )},
]

export default function FleetHealthPage() {
  return (
    <div>
      <SectionHeader
        title="Fleet Health"
        subtitle="Predictive maintenance and asset lifecycle management"
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {HEALTH_KPIS.map((k, i) => (
          <KpiCard key={i} {...k} delta={undefined} />
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS as Column<Record<string, unknown>>[]}
        data={FLEET_UNITS as unknown as Record<string, unknown>[]}
        searchPlaceholder="Search"
        searchKeys={['id']}
        buttonLabel="Clean Search"
        pageSize={8}
      />
    </div>
  )
}
