// components/ui/KpiCard.tsx
import {
  Clock, Zap, PauseCircle, Timer,
  AlertTriangle, Wrench, Fuel, TrendingDown,
  TrendingUp, Minus, RefreshCw, RotateCcw, LucideIcon,
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

// All icons used across the 8 KPI cards
const ICON_MAP: Record<string, LucideIcon> = {
  Clock,         // Total ON Hours (card 1 & 4)
  Zap,           // Effective Working Hours (card 2)
  PauseCircle,   // Idle Time (card 3)
  Timer,         // fallback timer
  RefreshCw,     // Hours Reduction (card 8) — green circular arrow
  RotateCcw,     // Total ON Hours repeat (card 4) — circular arrow Figma style
  AlertTriangle, // Congestion Index (card 5)
  Wrench,        // Maintenance Risk (card 6)
  Fuel,          // Energy Estimate (card 7)
  TrendingDown,
}

const DELTA_CFG = {
  up:     { color: 'text-green-600 bg-green-50',  Icon: TrendingUp,   prefix: '↑' },
  down:   { color: 'text-red-500   bg-red-50',    Icon: TrendingDown, prefix: '↓' },
  stable: { color: 'text-gray-500  bg-gray-100',  Icon: Minus,        prefix: ''  },
}

function parsePct(value: string): number {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return 0
  if (value.includes('%'))   return Math.min(num, 100)
  if (value.includes('h'))   return Math.min((num / 1500) * 100, 100)
  if (value.includes('L'))   return Math.min((num / 6000) * 100, 100)
  if (value.includes('Unit'))return Math.min(num * 20, 100)
  return Math.min(num * 10, 100)
}

const BG_TO_HEX: Record<string, string> = {
  'bg-pink-500':   '#ec4899',
  'bg-green-600':  '#16a34a',
  'bg-indigo-500': '#6366f1',
  'bg-blue-600':   '#2563eb',
  'bg-purple-500': '#a855f7',
}

export default function KpiCard({
  value, label, subLabel, delta, deltaType = 'stable', iconBg, icon,
}: KpiData) {
  const Icon     = ICON_MAP[icon] ?? Clock
  const deltaCfg = DELTA_CFG[deltaType]
  const pct      = parsePct(value)
  const barColor = BG_TO_HEX[iconBg] ?? '#1a237e'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pt-4 pb-3 flex flex-col hover:shadow-md transition-shadow">

      {/* Row 1: icon + delta */}
      <div className="flex items-center justify-between mb-3">
        <div className={`${iconBg} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon size={17} className="text-white" />
        </div>
        {delta && (
          <div className={`flex items-center gap-0.5 text-[12px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${deltaCfg.color}`}>
            <deltaCfg.Icon size={11} />
            {delta}
          </div>
        )}
      </div>

      {/* Row 2: big value */}
      <div className="text-[30px] font-black text-gray-900 leading-none tracking-tight mb-1.5">
        {value}
      </div>

      {/* Row 3: label */}
      <div className="text-[17px] font-semibold text-gray-700 leading-snug mb-0.5">
        {label}
      </div>

      {/* Row 4: subLabel */}
      {subLabel && (
        <div className="text-[15px] text-gray-400 mb-3 leading-tight">{subLabel}</div>
      )}

      {/* Row 5: progress bar */}
      {pct > 0 && (
        <div className="mt-auto pt-1">
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
