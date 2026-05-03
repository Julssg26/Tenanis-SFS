'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import MapPlaceholder from '@/components/control-tower/MapPlaceholder'
import { getMockFleet } from '@/lib/fleet/mockFleet'
import { getMockAlerts } from '@/lib/alerts/mockAlerts'

const FLEET  = getMockFleet()
const ALERTS = getMockAlerts()

// ── Inner component that reads searchParams ────────────────────────────────────
function ControlTowerInner() {
  const searchParams    = useSearchParams()
  const [activeTab, setActiveTab] = useState<'camera' | 'forklift' | 'heatmap' | 'stacking'>('camera')

  const handleTabChange = (tab: string) => {
    if (tab === 'camera' || tab === 'forklift' || tab === 'heatmap' || tab === 'stacking') setActiveTab(tab)
  }
  const [initialUnit, setInitialUnit] = useState<string | null>(null)
  const [alertBanner, setAlertBanner] = useState<string | null>(null)
  const didInit = useRef(false)

  useEffect(() => {
    if (didInit.current) return
    didInit.current = true

    const unitParam  = searchParams.get('unit')
    const alertParam = searchParams.get('alert')

    if (alertParam) {
      // Find alert → resolve unit
      const alert = ALERTS.find(a => a.id === alertParam)
      if (alert) {
        setAlertBanner(`Alert: ${alert.title} — ${alert.unitName} · ${alert.zone}`)
        setInitialUnit(alert.unitId)
      }
    } else if (unitParam) {
      // Direct unit selection
      const unit = FLEET.find(u => u.id === unitParam)
      if (unit) setInitialUnit(unit.id)
    }
  }, [searchParams])

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-[24px] font-bold text-[#1a237e]">Control Tower</h1>
        <p className="text-[13px] text-green-600 font-medium mt-0.5">
          Live industrial operations — Tenaris Tamsa
        </p>
      </div>

      {/* Alert context banner */}
      {alertBanner && (
        <div className="mb-4 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2 text-[12px] text-amber-800">
            <span className="text-amber-500">⚠</span>
            {alertBanner}
          </div>
          <button
            onClick={() => setAlertBanner(null)}
            className="text-amber-400 hover:text-amber-600 text-[16px] leading-none"
          >
            ×
          </button>
        </div>
      )}

      <MapPlaceholder
        activeTab={activeTab}
        onTabChange={handleTabChange}
        initialUnitId={initialUnit}
      />
    </div>
  )
}

// Wrap in Suspense because useSearchParams requires it in App Router
export default function ControlTowerPage() {
  return (
    <Suspense fallback={null}>
      <ControlTowerInner />
    </Suspense>
  )
}
