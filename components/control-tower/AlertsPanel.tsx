// components/control-tower/AlertsPanel.tsx
'use client'

import { useState } from 'react'
import type { Alert, AlertSeverity } from '@/lib/alerts/types'
import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react'

const SEV_CFG: Record<AlertSeverity, { Icon: typeof AlertTriangle; color: string; bg: string; border: string }> = {
  critical: { Icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200'    },
  warning:  { Icon: AlertTriangle, color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200'  },
  info:     { Icon: Info,          color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

interface Props {
  alerts: Alert[]
}

export default function AlertsPanel({ alerts }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visible = alerts.filter(a => !dismissed.has(a.id))
  const active  = visible.filter(a => a.status === 'active').length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[#1a237e]">Active Alerts</span>
          {active > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
              {active}
            </span>
          )}
        </div>
        {dismissed.size > 0 && (
          <button
            onClick={() => setDismissed(new Set())}
            className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <CheckCircle size={11} /> Restore all
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-[12px]">
          <CheckCircle size={20} className="mx-auto mb-2 text-green-400" />
          No active alerts
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((alert) => {
            const cfg = SEV_CFG[alert.severity]
            return (
              <div
                key={alert.id}
                className={`rounded-xl border px-3 py-2.5 ${cfg.bg} ${cfg.border} ${
                  alert.status === 'acknowledged' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <cfg.Icon size={14} className={`flex-shrink-0 mt-0.5 ${cfg.color}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-semibold text-gray-800">{alert.title}</span>
                        {alert.status === 'acknowledged' && (
                          <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">ACK</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 leading-tight">{alert.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                        <span>📍 {alert.zone}</span>
                        <span>🚧 {alert.unitName}</span>
                        <span>⏱ {timeAgo(alert.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDismissed(prev => new Set(prev).add(alert.id))}
                    className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
                    title="Dismiss"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
