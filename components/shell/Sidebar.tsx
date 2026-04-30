'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Antenna,
  BarChart2,
  HeartPulse,
  Cpu,
  Users,
  Settings,
} from 'lucide-react'

// Custom Apps icon — loaded from /public/icons/apps-icon.png
function AppsIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/icons/apps-icon.png"
      alt="Apps"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}

const NAV_ITEMS = [
  { label: 'Dashboard',     href: '/dashboard',      Icon: LayoutDashboard },
  { label: 'Control Tower', href: '/control-tower',  Icon: Antenna         },
  { label: 'Performance',   href: '/performance',    Icon: BarChart2       },
  { label: 'Fleet Health',  href: '/fleet-health',   Icon: HeartPulse      },
  { label: 'Simulator',     href: '/simulator',      Icon: Cpu             },
  { label: 'Drivers',       href: '/drivers',        Icon: Users           },
  // Apps uses custom PNG icon — handled separately below
  { label: 'Settings',      href: '/settings',       Icon: Settings        },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-[152px] bg-white border-r border-gray-200 flex flex-col justify-between z-10">
      <nav className="flex flex-col gap-0.5 pt-3 px-2">
        {/* Standard nav items before Apps */}
        {NAV_ITEMS.slice(0, 6).map(({ label, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-[11px] font-medium transition-colors ${
              isActive(href)
                ? 'bg-[#1a237e] text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}

        {/* Apps — custom icon */}
        <Link
          href="/apps"
          className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-[11px] font-medium transition-colors ${
            isActive('/apps')
              ? 'bg-[#1a237e] text-white'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <AppsIcon
            size={20}
            className={isActive('/apps') ? 'brightness-0 invert' : 'opacity-60'}
          />
          Apps
        </Link>

        {/* Settings */}
        {NAV_ITEMS.slice(6).map(({ label, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-[11px] font-medium transition-colors ${
              isActive(href)
                ? 'bg-[#1a237e] text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom logo */}
      <div className="pb-4 px-3 flex flex-col items-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/tenaris-logo.png" alt="Tenaris" className="w-[112px] object-contain" />
        <div className="text-[9px] text-gray-400 mt-1">© 2026 - TSFS</div>
      </div>
    </aside>
  )
}
