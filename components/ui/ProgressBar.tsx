import clsx from 'clsx'

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}

function getColor(pct: number) {
  if (pct >= 80) return 'bg-red-500'
  if (pct >= 60) return 'bg-orange-400'
  if (pct >= 40) return 'bg-green-500'
  return 'bg-green-500'
}

export default function ProgressBar({ value, max = 100, showLabel = true, size = 'sm', className }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className={clsx('flex-1 bg-gray-200 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2')}>
        <div
          className={clsx('h-full rounded-full transition-all', getColor(pct))}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[12px] font-semibold text-gray-700 w-8 text-right">{pct}%</span>
      )}
    </div>
  )
}

// Score bar (green-filled, used in fleet health)
export function ScoreBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-400' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className={clsx('h-full rounded-full', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] text-gray-600 w-8 text-right">{value} %</span>
    </div>
  )
}
