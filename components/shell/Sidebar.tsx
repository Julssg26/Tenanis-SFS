'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Antenna,
  BarChart2,
  HeartPulse,
  ClipboardList,
  Clapperboard,
  Settings,
} from 'lucide-react'

// Custom icon for PNG assets (Apps, AI Chat)
function CustomIcon({
  src, alt, active,
}: { src: string; alt: string; active: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src} alt={alt} width={22} height={22}
      className={active ? 'sidebar-icon-active' : 'sidebar-icon-inactive'}
      style={{
        objectFit: 'contain',
        display: 'block',
        filter: active
          ? 'brightness(0) invert(1)'
          : 'brightness(0) invert(0) opacity(0.5)',
      }}
    />
  )
}

// All hrefs must be unique — Simulator removed (content now lives in Control Tower tabs)
const NAV_ITEMS = [
  { label: 'Dashboard',     href: '/dashboard',     Icon: LayoutDashboard },
  { label: 'Control Tower', href: '/control-tower', Icon: Antenna         },
  { label: 'Performance',   href: '/performance',   Icon: BarChart2       },
  { label: 'Fleet Health',  href: '/fleet-health',  Icon: HeartPulse      },
  { label: 'Tasks',         href: '/drivers',       Icon: ClipboardList   },
  { label: 'Events',        href: '/events',        Icon: Clapperboard    },
  { label: 'Settings',      href: '/settings',      Icon: Settings        },
]

const LINK = 'flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-[11px] font-medium transition-colors'
const ON   = 'bg-[#1a237e] text-white'
const OFF  = 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'

export default function Sidebar() {
  const pathname = usePathname()
  const isOn = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-[152px] bg-white border-r border-gray-200 flex flex-col justify-between z-10">
      <nav className="flex flex-col gap-0.5 pt-3 px-2">

        {/* Dashboard → Tasks (indices 0-4) */}
        {NAV_ITEMS.slice(0, 5).map(({ label, href, Icon }) => (
          <Link key={href} href={href} className={`${LINK} ${isOn(href) ? ON : OFF}`}>
            <Icon size={20} />
            {label}
          </Link>
        ))}

        {/* Events (index 5) */}
        {NAV_ITEMS.slice(5, 6).map(({ label, href, Icon }) => (
          <Link key={href} href={href} className={`${LINK} ${isOn(href) ? ON : OFF}`}>
            <Icon size={20} />
            {label}
          </Link>
        ))}

        {/* Apps — custom PNG icon */}
        <Link href="/apps" className={`${LINK} ${isOn('/apps') ? ON : OFF}`}>
          <CustomIcon src="/images/icons/apps-icon.png" alt="Apps" active={isOn('/apps')} />
          Apps
        </Link>

        {/* AI Chat — custom PNG icon */}
        <Link href="/chat" className={`${LINK} ${isOn('/chat') ? ON : OFF}`}>
          <CustomIcon src="/images/icons/chat-icon.png" alt="AI Chat" active={isOn('/chat')} />
          AI Chat
        </Link>

        {/* Settings */}
        {NAV_ITEMS.slice(6).map(({ label, href, Icon }) => (
          <Link key={href} href={href} className={`${LINK} ${isOn(href) ? ON : OFF}`}>
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Tenaris logo */}
      <div className="pb-4 px-3 flex flex-col items-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/tenaris-logo.png" alt="Tenaris" className="w-[112px] object-contain" />
        <div className="text-[9px] text-gray-400 mt-1">© 2026 - TSFS</div>
      </div>
    </aside>
  )
}
