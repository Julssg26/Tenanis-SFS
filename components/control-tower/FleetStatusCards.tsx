// components/control-tower/FleetStatusCards.tsx
'use client'

import type { FleetUnit, FleetStatus } from '@/lib/fleet/types'

const STATUS_CFG: Record<FleetStatus, { label: string; dot: string; text: string; ring: string }> = {
  active:      { label: 'Active',      dot: 'bg-green-500', text: 'text-green-700', ring: 'ring-green-200'  },
  idle:        { label: 'Idle',        dot: 'bg-gray-400',  text: 'text-gray-500',  ring: 'ring-gray-200'   },
  maintenance: { label: 'Maintenance', dot: 'bg-red-500',   text: 'text-red-700',   ring: 'ring-red-200'    },
  warning:     { label: 'Warning',     dot: 'bg-amber-500', text: 'text-amber-700', ring: 'ring-amber-200'  },
}

function MiniBar({ value, high = 80, low = 20 }: { value: number; high?: number; low?: number }) {
  const color = value >= high ? 'bg-red-400' : value <= low ? 'bg-green-500' : 'bg-amber-400'
  return (
    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  )
}

interface Props {
  units: FleetUnit[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function FleetStatusCards({ units, selectedId, onSelect }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold text-[#1a237e]">Fleet Units</span>
        <span className="text-[11px] text-gray-400">{units.length} units</span>
      </div>

      {/* Horizontal scroll row of compact cards */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {units.map((unit) => {
          const cfg     = STATUS_CFG[unit.status]
          const selected = unit.id === selectedId
          return (
            <button
              key={unit.id}
              onClick={() => onSelect(unit.id)}
              className={`flex-shrink-0 w-[190px] text-left rounded-xl border p-3 transition-all ${
                selected
                  ? 'border-[#1a237e] bg-[#e8eaf6] ring-2 ring-[#1a237e]/20'
                  : `bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white`
              }`}
            >
              {/* Name + status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold text-gray-800 truncate pr-1">{unit.name}</span>
                <div className={`flex items-center gap-1 flex-shrink-0 ${cfg.text}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  <span className="text-[10px] font-medium">{cfg.label}</span>
                </div>
              </div>

              {/* Zone + operator */}
              <div className="text-[10px] text-gray-500 mb-2 space-y-0.5">
                <div className="truncate">📍 {unit.currentZone}</div>
                <div className="truncate">👤 {unit.operatorName}</div>
              </div>

              {/* Mini metrics */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Fuel</span><span>{unit.fuelLevel}%</span>
                </div>
                <MiniBar value={unit.fuelLevel} high={90} low={20} />

                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Utilization</span><span>{unit.utilization}%</span>
                </div>
                <MiniBar value={unit.utilization} high={90} low={20} />

                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Maint. Risk</span><span>{unit.maintenanceRisk}%</span>
                </div>
                <MiniBar value={unit.maintenanceRisk} high={70} low={30} />
              </div>

              {/* Active route pill */}
              {unit.activeRoute && (
                <div className="mt-2 text-[9px] text-[#1a237e] bg-[#e8eaf6] rounded px-1.5 py-0.5 truncate">
                  🗺 {unit.activeRoute}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
