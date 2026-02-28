import clsx from 'clsx'

interface BadgeProps {
  label: string | number
  color?: 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'orange'
  size?: 'sm' | 'md'
}

const COLORS = {
  green:  'bg-green-600 text-white',
  yellow: 'bg-yellow-400 text-white',
  red:    'bg-red-500 text-white',
  gray:   'bg-gray-500 text-white',
  blue:   'bg-[#1a237e] text-white',
  orange: 'bg-orange-500 text-white',
}

export default function Badge({ label, color = 'gray', size = 'md' }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center justify-center font-semibold rounded-md',
      COLORS[color],
      size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[12px] px-2.5 py-1'
    )}>
      {label}
    </span>
  )
}

// Risk level badge variant
export function RiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const map = {
    Low:    'bg-green-100 text-green-700 border border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    High:   'bg-red-100 text-red-700 border border-red-200',
  }
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-semibold', map[level])}>
      {level}
    </span>
  )
}

// Integration status badge
export function StatusBadge({ status }: { status: 'Connected' | 'Partial' | 'Disconnected' }) {
  const map = {
    Connected:    'bg-green-600 text-white',
    Partial:      'bg-yellow-500 text-white',
    Disconnected: 'bg-gray-400 text-white',
  }
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-1 rounded text-[11px] font-semibold', map[status])}>
      {status}
    </span>
  )
}
