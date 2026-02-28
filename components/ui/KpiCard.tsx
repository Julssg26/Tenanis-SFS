import {
  Clock, Zap, PauseCircle, Timer, AlertTriangle,
  Wrench, Fuel, TrendingDown, TrendingUp, Minus,
  CheckCircle2, Users, Activity
} from 'lucide-react'
import clsx from 'clsx'

const ICON_MAP: Record<string, React.ElementType> = {
  Clock, Zap, PauseCircle, Timer, AlertTriangle,
  Wrench, Fuel, TrendingDown, TrendingUp,
  CheckCircle2, Users, Activity,
}

interface KpiCardProps {
  value: string
  label: string
  subLabel?: string
  delta?: string
  deltaType?: 'up' | 'down' | 'stable'
  iconBg?: string
  icon?: string
}

export default function KpiCard({
  value, label, subLabel, delta, deltaType = 'stable', iconBg = 'bg-pink-500', icon = 'Activity'
}: KpiCardProps) {
  const Icon = ICON_MAP[icon] ?? Activity

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Delta badge */}
      {delta && (
        <div className={clsx(
          'absolute top-3 right-3 flex items-center gap-0.5 text-[11px] font-semibold',
          deltaType === 'up' ? 'text-green-600' :
          deltaType === 'down' ? 'text-red-500' : 'text-gray-500'
        )}>
          {deltaType === 'up' ? <TrendingUp size={11} /> :
           deltaType === 'down' ? <TrendingDown size={11} /> :
           <Minus size={11} />}
          {delta}
        </div>
      )}

      {/* Icon */}
      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-3', iconBg)}>
        <Icon size={18} className="text-white" />
      </div>

      {/* Value */}
      <div className="text-[24px] font-bold text-gray-900 leading-tight">{value}</div>

      {/* Label */}
      <div className="text-[13px] text-gray-600 mt-0.5">{label}</div>

      {/* Sub label */}
      {subLabel && (
        <div className="text-[11px] text-gray-400 mt-0.5">{subLabel}</div>
      )}
    </div>
  )
}
