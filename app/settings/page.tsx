'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon, Clock, Bell } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AlgorithmWeights from '@/components/settings/AlgorithmWeights'
import IntegrationStatus from '@/components/settings/IntegrationStatus'
import { SHIFT_DEFS, ALERT_THRESHOLDS } from '@/lib/mock-data'

// ── Theme helpers ─────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark'

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  try { localStorage.setItem('tsfs-theme', t) } catch { /* */ }
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tsfs-theme') as Theme | null
      if (saved === 'dark' || saved === 'light') setTheme(saved)
    } catch { /* */ }
  }, [])

  function selectTheme(t: Theme) { setTheme(t); applyTheme(t) }

  return (
    <div>
      <SectionHeader
        title="Settings"
        subtitle="System configuration and algorithm parameters"
      />

      {/* ── Appearance ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="text-[14px] font-semibold text-gray-800 mb-3">Appearance</div>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {([
            { id: 'light' as Theme, label: 'Light Mode', Icon: Sun,  preview: 'bg-[#f1f3f7] text-gray-900 light-mode-preview' },
            { id: 'dark'  as Theme, label: 'Dark Mode',  Icon: Moon, preview: 'bg-[#0f1117] text-slate-100' },
          ] as const).map(({ id, label, Icon, preview }) => {
            const active = theme === id
            return (
              <button key={id} onClick={() => selectTheme(id)}
                className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                  active ? 'theme-btn-active border-[#1a237e] bg-[#e8eaf6]' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${preview}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="theme-btn-label text-[13px] font-semibold text-gray-800">{label}</div>
                  {active && <div className="text-[10px] text-[#1a237e] font-medium">Active</div>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Original 2-col settings grid ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Algorithm Weights */}
        <AlgorithmWeights />

        {/* Shift Definitions */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-[#1a237e]" />
            <span className="text-[14px] font-semibold text-gray-800">Shift Definitions</span>
          </div>
          <div className="text-[12px] text-gray-500 mb-4">Operating shift schedule</div>
          <div className="space-y-3">
            {SHIFT_DEFS.map(shift => (
              <div key={shift.name}
                className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-gray-800">{shift.name}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{shift.hours}</div>
                </div>
                <div className="text-[12px] text-gray-600">{shift.operators} operators</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={16} className="text-[#1a237e]" />
            <span className="text-[14px] font-semibold text-gray-800">Alert Thresholds</span>
          </div>
          <div className="text-[12px] text-gray-500 mb-4">Trigger conditions for notifications</div>
          <div className="space-y-3">
            {ALERT_THRESHOLDS.map(a => (
              <div key={a.label}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-[13px] text-gray-700">{a.label}</span>
                <span className="bg-gray-800 text-white text-[12px] font-mono px-3 py-1 rounded-lg">
                  {a.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Status */}
        <IntegrationStatus />

      </div>
    </div>
  )
}
