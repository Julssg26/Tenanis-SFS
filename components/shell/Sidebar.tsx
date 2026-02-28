'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Antenna, BarChart2, HeartPulse,
  Cpu, Users, Settings
} from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { label: 'Dashboard',     href: '/dashboard',      Icon: LayoutDashboard },
  { label: 'Control Tower', href: '/control-tower',  Icon: Antenna         },
  { label: 'Performance',   href: '/performance',    Icon: BarChart2       },
  { label: 'Fleet Health',  href: '/fleet-health',   Icon: HeartPulse      },
  { label: 'Simulator',     href: '/simulator',      Icon: Cpu             },
  { label: 'Drivers',       href: '/drivers',        Icon: Users           },
  { label: 'Settings',      href: '/settings',       Icon: Settings        },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-[56px] bottom-0 w-[152px] bg-white border-r border-gray-200 flex flex-col z-30">
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex flex-col items-center gap-1 px-2 py-3 mx-2 my-0.5 rounded-lg text-[11px] font-medium transition-colors',
                active
                  ? 'bg-[#1a237e] text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              )}
            >
              <Icon size={18} />
              <span className="text-center leading-tight">{label}</span>
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#1a237e] rounded-l" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Tenaris Logo bottom */}
      <div className="px-4 pb-5 pt-3 border-t border-gray-100">
        <img
          src="/tenaris-logo.png"
          alt="Tenaris"
          className="w-[112px] object-contain"
        />
        <div className="text-[9px] text-gray-400 mt-1">© 2026 - TSFS</div>
      </div>
    </aside>
  )
}
