'use client'

import { usePathname } from 'next/navigation'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

// Pages that should render WITHOUT the shell (login, etc.)
const NO_SHELL_ROUTES = ['/']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Login page — render children only, no Topbar/Sidebar
  if (NO_SHELL_ROUTES.includes(pathname)) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#f1f3f7] overflow-x-hidden">
      <Topbar />
      <Sidebar />
      <main className="ml-[152px] mt-14 p-6 min-h-[calc(100vh-56px)] min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
