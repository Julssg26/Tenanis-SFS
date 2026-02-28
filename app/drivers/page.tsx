'use client'

import SectionHeader from '@/components/ui/SectionHeader'
import KpiCard from '@/components/ui/KpiCard'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import type { Column } from '@/components/ui/DataTable'
import { OPERATORS } from '@/lib/mock-data'
import type { Operator } from '@/lib/types'
import clsx from 'clsx'

const DRIVER_KPIS = [
  { value: '7',    label: 'Active Operators', subLabel: '', iconBg: 'bg-blue-500',   icon: 'Users'    },
  { value: '86 %', label: 'Avg Performance',  subLabel: '', iconBg: 'bg-green-500',  icon: 'Activity' },
  { value: '3',    label: 'With Incidents',   subLabel: '', iconBg: 'bg-yellow-400', icon: 'AlertTriangle' },
  { value: '3',    label: 'Training Flagged', subLabel: '', iconBg: 'bg-pink-500',   icon: 'Clock'    },
]

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? 'green' :
    score >= 80 ? 'green' :
    score >= 70 ? 'yellow' : 'red'
  return <Badge label={score} color={color as 'green' | 'yellow' | 'red'} />
}

function IdleBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const map = {
    Low:    'bg-gray-100 text-gray-600',
    Medium: 'bg-yellow-100 text-yellow-700',
    High:   'bg-red-100 text-red-700',
  }
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold', map[level])}>
      {level}
    </span>
  )
}

const COLUMNS: Column<Operator>[] = [
  { key: 'name',       header: 'Operator'                                                                       },
  { key: 'opId',       header: 'ID'                                                                             },
  { key: 'unit',       header: 'Unit'                                                                           },
  { key: 'shift',      header: 'Shift'                                                                          },
  { key: 'compliance', header: 'Compliance',  render: r => `${r.compliance} %`                                  },
  { key: 'score',      header: 'Score',       render: r => <ScoreBadge score={r.score} />,       align: 'center' },
  { key: 'incidents',  header: 'Incidents',   render: r => <Badge label={r.incidents} color={r.incidents === 0 ? 'green' : 'red'} />, align: 'center' },
  { key: 'idlePattern',header: 'Idle Pattern',render: r => <IdleBadge level={r.idlePattern} />,  align: 'center' },
  { key: 'training',   header: 'Training',    render: r => r.training ? <Badge label="Recommended" color="red" /> : null, align: 'center' },
]

export default function DriversPage() {
  return (
    <div>
      <SectionHeader
        title="Operator Management"
        subtitle="Monitor and support driver performance improvement"
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {DRIVER_KPIS.map((k, i) => (
          <KpiCard key={i} {...k} delta={undefined} />
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS as Column<Record<string, unknown>>[]}
        data={OPERATORS as unknown as Record<string, unknown>[]}
        searchPlaceholder="Search"
        searchKeys={['name', 'opId', 'unit']}
        buttonLabel="Clean Search"
        pageSize={7}
      />
    </div>
  )
}
