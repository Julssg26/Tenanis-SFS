export const NAV_ITEMS = [
  { label: 'Dashboard',      href: '/dashboard',      icon: 'LayoutDashboard' },
  { label: 'Control Tower',  href: '/control-tower',  icon: 'Antenna' },
  { label: 'Performance',    href: '/performance',    icon: 'BarChart2' },
  { label: 'Fleet Health',   href: '/fleet-health',   icon: 'HeartPulse' },
  { label: 'Simulator',      href: '/simulator',      icon: 'Cpu' },
  { label: 'Drivers',        href: '/drivers',        icon: 'Users' },
  { label: 'Settings',       href: '/settings',       icon: 'Settings' },
] as const

export const STATUS_COLORS: Record<string, string> = {
  Active:          '#16a34a',
  'Loading/Unloading': '#eab308',
  Idle:            '#f97316',
  'Excessive Idle': '#ef4444',
  Maintenance:     '#6366f1',
}

export const RISK_BADGE: Record<string, string> = {
  Low:    'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High:   'bg-red-100 text-red-700',
}

export const IDLE_BADGE: Record<string, string> = {
  Low:    'bg-gray-100 text-gray-600',
  Medium: 'bg-yellow-100 text-yellow-700',
  High:   'bg-red-100 text-red-700',
}
