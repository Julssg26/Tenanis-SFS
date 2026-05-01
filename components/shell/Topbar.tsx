'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Search, ChevronDown } from 'lucide-react'
import { getMockAlerts } from '@/lib/alerts/mockAlerts'
import type { Alert, AlertSeverity } from '@/lib/alerts/types'

// ── Static alerts — replace with Supabase query later ─────────────────────────
const ALL_ALERTS = getMockAlerts()

const SEV_COLOR: Record<AlertSeverity, string> = {
  critical: '#dc2626',
  warning:  '#d97706',
  info:     '#2563eb',
}
const SEV_BG: Record<AlertSeverity, string> = {
  critical: 'bg-red-50   border-red-200',
  warning:  'bg-amber-50 border-amber-200',
  info:     'bg-blue-50  border-blue-200',
}

function timeAgo(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  return m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`
}

export default function Topbar() {
  const [open, setOpen]           = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const panelRef                  = useRef<HTMLDivElement>(null)

  const visible     = ALL_ALERTS.filter(a => !dismissed.has(a.id) && a.status !== 'resolved')
  const activeCount = visible.filter(a => a.status === 'active').length

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#1a237e] z-20 flex items-center px-4 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2 w-[152px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/isotipo.png" alt="TSFS" className="w-8 h-8 object-contain brightness-0 invert" />
        <div className="leading-tight">
          <div className="text-white text-[12px] font-bold">Tenaris Smart</div>
          <div className="text-white/70 text-[10px]">Fleet System</div>
        </div>
      </div>

      {/* Collapse toggle placeholder */}
      <button className="text-white/60 hover:text-white p-1.5 rounded-lg transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-[420px]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search tractors, trailers, operators..."
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-1.5 text-[13px] text-white placeholder-white/40 outline-none focus:bg-white/15 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* ── Notifications bell ──────────────────────────────────────────────── */}
      <div className="relative" ref={panelRef}>
        <button
          onClick={() => setOpen(o => !o)}
          className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Bell size={18} />
          {activeCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeCount > 9 ? '9+' : activeCount}
            </span>
          )}
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-gray-800">Notifications</span>
                {activeCount > 0 && (
                  <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {activeCount} active
                  </span>
                )}
              </div>
              {dismissed.size > 0 && (
                <button
                  onClick={() => setDismissed(new Set())}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Restore all
                </button>
              )}
            </div>

            {/* Alert list */}
            <div className="max-h-[400px] overflow-y-auto">
              {visible.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="text-gray-300 text-[28px] mb-2">✓</div>
                  <p className="text-[13px] text-gray-400">No pending alerts</p>
                </div>
              ) : (
                visible.map((alert: Alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                      alert.status === 'acknowledged' ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Severity dot */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: SEV_COLOR[alert.severity] }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-semibold text-gray-800 truncate">{alert.title}</span>
                        {alert.status === 'acknowledged' && (
                          <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded flex-shrink-0">ACK</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight mb-1">{alert.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        <span>📍 {alert.zone}</span>
                        <span>🚧 {alert.unitName}</span>
                        <span>{timeAgo(alert.createdAt)}</span>
                      </div>
                    </div>

                    {/* Dismiss */}
                    <button
                      onClick={() => setDismissed(prev => new Set([...prev, alert.id]))}
                      className="flex-shrink-0 text-gray-300 hover:text-gray-500 text-[16px] leading-none mt-0.5 transition-colors"
                      title="Dismiss"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
              <p className="text-[10px] text-gray-400 text-center">
                Alerts update automatically — Supabase integration coming soon
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User pill */}
      <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-white/15 transition-colors">
        <div className="w-7 h-7 rounded-full bg-[#e91e8c] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
          JP
        </div>
        <div className="leading-tight hidden sm:block">
          <div className="text-white text-[11px] font-medium">JUAN_PEREZ@mail.com</div>
          <div className="text-white/60 text-[10px]">User Admin</div>
        </div>
        <ChevronDown size={12} className="text-white/50" />
      </div>
    </header>
  )
}
