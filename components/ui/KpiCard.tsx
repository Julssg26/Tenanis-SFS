// components/ui/KpiCard.tsx
import {
  Clock, Zap, PauseCircle, Timer,
  AlertTriangle, Wrench, Fuel, TrendingDown,
  TrendingUp, Minus, LucideIcon,
} from 'lucide-react'

export interface KpiData {
  value:      string
  label:      string
  subLabel?:  string
  delta?:     string
  deltaType?: 'up' | 'down' | 'stable'
  iconBg:     string
  icon:       string
}

const ICON_MAP: Record<string, LucideIcon> = {
  Clock, Zap, PauseCircle, Timer, AlertTriangle, Wrench, Fuel, TrendingDown,
}

const DELTA_CFG = {
  up:     { color: 'text-green-700 bg-green-100', Icon: TrendingUp   },
  down:   { color: 'text-red-600   bg-red-100',   Icon: TrendingDown },
  stable: { color: 'text-gray-500  bg-gray-100',  Icon: Minus        },
}

// ── Parse a 0–100 fill from value string ──────────────────────────────────────
function parsePct(value: string): number {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return 0
  if (value.includes('%'))  return Math.min(num, 100)
  if (value.includes('h'))  return Math.min((num / 1500) * 100, 100)
  if (value.includes('L'))  return Math.min((num / 6000) * 100, 100)
  if (value.includes('Unit')) return Math.min(num * 20, 100)
  return Math.min(num * 10, 100)
}

const BG_TO_HEX: Record<string, string> = {
  'bg-pink-500':   '#ec4899',
  'bg-green-600':  '#16a34a',
  'bg-indigo-500': '#6366f1',
}

export default function KpiCard({
  value, label, subLabel, delta, deltaType = 'stable', iconBg, icon,
}: KpiData) {
  // Always fall back to Clock so no card is ever icon-less
  const Icon     = ICON_MAP[icon] ?? Clock
  const deltaCfg = DELTA_CFG[deltaType]
  const pct      = parsePct(value)
  const barColor = BG_TO_HEX[iconBg] ?? '#1a237e'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pt-4 pb-3 flex flex-col hover:shadow-md transition-shadow">

      {/* Row 1: icon pill + label + delta */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`${iconBg} w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon size={14} className="text-white" />
          </div>
          <span className="text-[11px] font-semibold text-gray-500 leading-tight">{label}</span>
        </div>
        {delta && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${deltaCfg.color}`}>
            <deltaCfg.Icon size={10} />
            {delta}
          </div>
        )}
      </div>

      {/* Row 2: big value */}
      <div className="text-[26px] font-black text-gray-900 leading-none tracking-tight mb-1">
        {value}
      </div>

      {/* Row 3: subLabel */}
      {subLabel && (
        <div className="text-[11px] text-gray-400 mb-3 leading-tight">{subLabel}</div>
      )}

      {/* Row 4: progress bar */}
      {pct > 0 && (
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-gray-300 uppercase tracking-wide">vs capacity</span>
            <span className="text-[9px] font-semibold" style={{ color: barColor }}>{Math.round(pct)}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
