'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const isLogin   = pathname === '/'
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // On the login page, never block — just mark as checked
    if (isLogin) { setChecked(true); return }

    // On any other route, require auth
    if (localStorage.getItem('isAuth') !== '1') {
      router.replace('/')
      return
    }
    setChecked(true)
  }, [isLogin, router])

  // ── Login page: no shell, full-screen ──────────────────────────
  if (isLogin) {
    return <>{children}</>
  }

  // ── Protected routes: wait for auth check before rendering ─────
  if (!checked) return null

  return (
    <div className="min-h-screen bg-[#f1f3f7]">
      <Topbar />
      <Sidebar />
      <main className="ml-[152px] mt-14 p-6 min-h-[calc(100vh-56px)]">
        {children}
      </main>
    </div>
  )
}
