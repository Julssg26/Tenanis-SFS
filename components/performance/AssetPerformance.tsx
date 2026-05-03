// components/performance/AssetPerformance.tsx
// Asset Performance tab — inspired by the Tenaris monitoring reference (45-2249 screen)
'use client'

import { useState } from 'react'
import {
  Gauge, Clock, Fuel, Wifi, Zap, AlertTriangle,
  Battery, Wrench, MapPin, Activity,
} from 'lucide-react'
import { getMockFleet } from '@/lib/fleet/mockFleet'
import type { FleetUnit } from '@/lib/fleet/types'

// ── Extended mock metrics per unit ────────────────────────────────────────
interface AssetMetrics {
  mileageKm:      number
  usageHours:     number
  odometer:       number
  lastConnection: string
  speedKmh:       number
  rpm:            number
  lastFault:      string
  batteryV:       number
  fuelPct:        number
  maintRisk:      number
  engineModel:    string
}

const ASSET_METRICS: Record<string, AssetMetrics> = {
  'FK-01': {
    mileageKm: 148, usageHours: 13181, odometer: 190418,
    lastConnection: '03/03 09:48', speedKmh: 0, rpm: 0,
    lastFault: 'No active faults', batteryV: 25.96,
    fuelPct: 72, maintRisk: 18, engineModel: 'Cummins QSL 9L',
  },
  'FK-02': {
    mileageKm: 213, usageHours: 15440, odometer: 224830,
    lastConnection: '03/03 08:15', speedKmh: 4, rpm: 850,
    lastFault: 'Hydraulic pressure warning (P0281)', batteryV: 24.12,
    fuelPct: 45, maintRisk: 72, engineModel: 'Cummins QSB 6.7',
  },
  'YT-01': {
    mileageKm: 94, usageHours: 9820, odometer: 112050,
    lastConnection: '03/03 10:02', speedKmh: 12, rpm: 1200,
    lastFault: 'No active faults', batteryV: 27.40,
    fuelPct: 88, maintRisk: 25, engineModel: 'Caterpillar C4.4',
  },
  'CR-01': {
    mileageKm: 0, usageHours: 21050, odometer: 0,
    lastConnection: '02/28 14:30', speedKmh: 0, rpm: 0,
    lastFault: 'Engine overtemp fault — E0512', batteryV: 22.80,
    fuelPct: 100, maintRisk: 95, engineModel: 'Liebherr D934',
  },
}

// Fallback metrics for units not in the map
function defaultMetrics(unit: FleetUnit): AssetMetrics {
  return {
    mileageKm: Math.floor(Math.random() * 200 + 50),
    usageHours: Math.floor(unit.utilization * 150),
    odometer: Math.floor(Math.random() * 100000 + 50000),
    lastConnection: '03/03 07:00',
    speedKmh: unit.status === 'active' ? Math.floor(Math.random() * 20) : 0,
    rpm: unit.status === 'active' ? Math.floor(Math.random() * 1500 + 400) : 0,
    lastFault: unit.maintenanceRisk > 60 ? 'Check engine light — P0300' : 'No active faults',
    batteryV: 24 + Math.random() * 4,
    fuelPct: unit.fuelLevel,
    maintRisk: unit.maintenanceRisk,
    engineModel: 'Kubota V3800',
  }
}

// Status color helpers
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  active:      { bg: 'bg-green-50  border-green-200',  text: 'text-green-700',  dot: 'bg-green-500'  },
  idle:        { bg: 'bg-gray-50   border-gray-200',   text: 'text-gray-500',   dot: 'bg-gray-400'   },
  warning:     { bg: 'bg-amber-50  border-amber-200',  text: 'text-amber-700',  dot: 'bg-amber-500'  },
  maintenance: { bg: 'bg-red-50    border-red-200',    text: 'text-red-700',    dot: 'bg-red-500'    },
}

function riskColor(pct: number): string {
  if (pct >= 70) return 'text-red-600'
  if (pct >= 40) return 'text-amber-600'
  return 'text-green-600'
}

function MetricCard({
  icon: Icon, label, value, unit, sub, highlight,
}: {
  icon: typeof Gauge; label: string; value: string | number
  unit?: string; sub?: string; highlight?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1 min-h-[110px]">
      <div className="flex items-start justify-between">
        <Icon size={18} className="text-[#1a237e] opacity-70 flex-shrink-0" />
        {unit && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{unit}</span>}
      </div>
      <div className={`text-[28px] font-black leading-none mt-1 ${highlight ?? 'text-gray-900'}`}>
        {value}
      </div>
      <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AssetPerformance() {
  const fleet = getMockFleet()
  const [selectedId, setSelectedId] = useState<string>(fleet[0]?.id ?? '')

  const unit    = fleet.find(u => u.id === selectedId) ?? fleet[0]
  const metrics = ASSET_METRICS[unit?.id] ?? defaultMetrics(unit)
  const sc      = STATUS_COLORS[unit?.status ?? 'idle']

  return (
    <div className="flex gap-4 min-h-[500px]">

      {/* ── Left: Asset list ────────────────────────────────────────────── */}
      <div className="w-[220px] flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
            Vehicles ({fleet.length})
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {fleet.map(u => {
            const s   = STATUS_COLORS[u.status]
            const sel = u.id === selectedId
            return (
              <button
                key={u.id}
                onClick={() => setSelectedId(u.id)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  sel ? 'bg-[#e8eaf6]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-[12px] font-semibold ${sel ? 'text-[#1a237e]' : 'text-gray-800'}`}>
                    {u.name}
                  </span>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                  <MapPin size={9}/> {u.currentZone}
                </div>
                <div className={`text-[10px] font-medium mt-0.5 ${s.text}`}>
                  {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Right: Asset detail ─────────────────────────────────────────── */}
      <div className="flex-1 space-y-4 min-w-0">

        {/* Header */}
        <div className={`rounded-xl border p-4 ${sc.bg}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className={`text-[18px] font-bold ${sc.text}`}>{unit?.name}</div>
              <div className="flex items-center gap-2 mt-0.5 text-[12px] text-gray-500">
                <span className="capitalize">{unit?.type?.replace('_',' ')}</span>
                <span>·</span>
                <MapPin size={11}/>
                <span>{unit?.currentZone}</span>
                <span>·</span>
                <span>{metrics.engineModel}</span>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${sc.bg} ${sc.text}`}>
              <div className={`w-2 h-2 rounded-full ${sc.dot}`}/>
              {unit?.status?.charAt(0).toUpperCase()}{unit?.status?.slice(1)}
            </div>
          </div>
          {/* Sub-stats */}
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-200/50">
            <div className="text-center">
              <div className="text-[11px] text-gray-500">Operator</div>
              <div className="text-[12px] font-semibold text-gray-700">{unit?.operatorName}</div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-gray-500">Utilization</div>
              <div className="text-[12px] font-semibold text-gray-700">{unit?.utilization}%</div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-gray-500">Active Route</div>
              <div className="text-[12px] font-semibold text-gray-700">{unit?.activeRoute ?? '—'}</div>
            </div>
          </div>
        </div>

        {/* Metrics grid — 4 columns, 2 rows, matches reference layout */}
        <div className="grid grid-cols-4 gap-3">
          <MetricCard icon={Gauge}        label="Kilometraje Actual"  value={metrics.mileageKm}             unit="KM"    />
          <MetricCard icon={Clock}        label="Horas de Uso"        value={metrics.usageHours.toLocaleString()} unit="HS" />
          <MetricCard icon={Fuel}         label="Odo-Litro"           value={metrics.odometer.toLocaleString()}  unit="LTS" />
          <MetricCard icon={Wifi}         label="Última Conexión"     value={metrics.lastConnection}        unit="HS"
            sub={metrics.speedKmh === 0 ? 'Connected' : 'Live'} />

          <MetricCard icon={Activity}     label="Velocidad"           value={metrics.speedKmh}              unit="KM/H"  />
          <MetricCard icon={Gauge}        label="RPM"                 value={metrics.rpm}                   unit="RPM"   />
          <MetricCard icon={AlertTriangle} label="Últ. Falla"         value={metrics.lastFault === 'No active faults' ? '—' : '⚠'}
            sub={metrics.lastFault}
            highlight={metrics.lastFault === 'No active faults' ? 'text-green-600' : 'text-red-600'} />
          <MetricCard icon={Battery}      label="Batería"             value={metrics.batteryV.toFixed(2)}   unit="VOLTS" />
        </div>

        {/* Secondary metrics row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Fuel size={15} className="text-[#1a237e] opacity-70"/>
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Fuel Level</span>
              </div>
              <span className="text-[11px] font-bold text-gray-700">{metrics.fuelPct}%</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${
                metrics.fuelPct < 25 ? 'bg-red-500' : metrics.fuelPct < 50 ? 'bg-amber-400' : 'bg-green-500'
              }`} style={{ width: `${metrics.fuelPct}%` }} />
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              {metrics.fuelPct < 25 ? 'Low — schedule refuel' : metrics.fuelPct < 50 ? 'Moderate' : 'Good level'}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wrench size={15} className="text-[#1a237e] opacity-70"/>
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Maint. Risk</span>
              </div>
              <span className={`text-[11px] font-bold ${riskColor(metrics.maintRisk)}`}>{metrics.maintRisk}%</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${
                metrics.maintRisk >= 70 ? 'bg-red-500' : metrics.maintRisk >= 40 ? 'bg-amber-400' : 'bg-green-500'
              }`} style={{ width: `${metrics.maintRisk}%` }} />
            </div>
            <div className={`text-[10px] mt-1 ${riskColor(metrics.maintRisk)}`}>
              {metrics.maintRisk >= 70 ? 'Service required immediately' : metrics.maintRisk >= 40 ? 'Monitor — schedule service' : 'Good condition'}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-[#1a237e] opacity-70"/>
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Battery</span>
              </div>
            </div>
            <div className="text-[28px] font-black text-gray-900 leading-none">{metrics.batteryV.toFixed(2)}</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">Volts</div>
            <div className={`text-[10px] mt-1 font-medium ${metrics.batteryV >= 24 ? 'text-green-600' : 'text-amber-600'}`}>
              {metrics.batteryV >= 24 ? 'Normal voltage' : 'Low battery'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
