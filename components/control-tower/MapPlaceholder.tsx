'use client'

import dynamic from 'next/dynamic'
import { useRef, useState, useEffect } from 'react'
import { Camera, Truck } from 'lucide-react'
import AStarPanel      from './AStarPanel'
import FleetStatusCards from './FleetStatusCards'
import ActiveTrips     from './ActiveTrips'
import YardCapacity    from './YardCapacity'
import ProcessCard     from './ProcessCard'
import type { OLMapHandle } from './OLMap'
import { getMockFleet } from '@/lib/fleet/mockFleet'

const OLMap = dynamic(() => import('./OLMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-gray-900 flex items-center justify-center" style={{ height: 500 }}>
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
        </svg>
        <span className="text-[13px]">Loading satellite map…</span>
      </div>
    </div>
  ),
})

const TABS = [
  { id: 'camera',   label: 'Camera Monitor',   Icon: Camera },
  { id: 'forklift', label: 'Forklift Tracking', Icon: Truck  },
]
const CAMERA_LEGEND = [
  { color: '#3b82f6', label: 'Warehouse → MOTU'    },
  { color: '#16a34a', label: 'Maintenance → Green' },
  { color: '#eab308', label: 'Inspection → MOTU'   },
  { color: '#a855f7', label: 'A* Route'             },
]
const FORKLIFT_LEGEND = [
  { color: '#16a34a', label: 'Active'      },
  { color: '#6b7280', label: 'Idle'        },
  { color: '#dc2626', label: 'Maintenance' },
  { color: '#d97706', label: 'Warning'     },
]

const FLEET = getMockFleet()

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
  initialUnitId?: string | null
}

export default function MapPlaceholder({ activeTab, onTabChange, initialUnitId }: Props) {
  const olMapRef = useRef<OLMapHandle>(null)
  const [selectedId, setSelectedId] = useState<string | null>(initialUnitId ?? null)

  // Apply pre-selected unit from query params (Fase 6)
  useEffect(() => {
    if (!initialUnitId) return
    setSelectedId(initialUnitId)
    setTimeout(() => {
      olMapRef.current?.highlightUnit(initialUnitId)
      olMapRef.current?.centerOnUnit(initialUnitId)
    }, 800)
  }, [initialUnitId])

  const legend = activeTab === 'forklift' ? FORKLIFT_LEGEND : CAMERA_LEGEND

  function handleSelect(id: string) {
    const next = selectedId === id ? null : id
    setSelectedId(next)
    olMapRef.current?.highlightUnit(next)
    if (next) olMapRef.current?.centerOnUnit(next)
  }

  return (
    // ── Full-width wrapper ───────────────────────────────────────────────────
    <div className="space-y-4 min-w-0">

      {/* ── 2-column grid: map area + right sidebar ─────────────────────── */}
      <div className="grid grid-cols-[1fr_280px] gap-4 items-start min-w-0">

        {/* Map column */}
        <div className="space-y-0 min-w-0">

        {/* Map card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs + legend */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 pt-3 pb-0">
            <div className="flex">
              {TABS.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => onTabChange(id)}
                  className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium border-b-2 transition-colors mr-2 ${
                    activeTab === id
                      ? 'border-[#1a237e] text-[#1a237e]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pb-2 flex-wrap">
              {legend.map(item => (
                <div key={item.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* A* planner — camera tab only */}
          {activeTab === 'camera' && (
            <div className="px-4 pt-3">
              <AStarPanel
                onRoute={ids => olMapRef.current?.drawRoute(ids)}
                onClear={() => olMapRef.current?.clearRoute()}
              />
            </div>
          )}

          {/* Map */}
          <OLMap
            ref={olMapRef}
            activeTab={activeTab}
            selectedUnitId={selectedId}
            onUnitClick={handleSelect}
          />
        </div>

        </div>{/* end map column */}

        {/* ── RIGHT SIDEBAR ───────────────────────────────────────────── */}
        <div className="space-y-4">
          <ActiveTrips activeTab={activeTab} />
          <YardCapacity />
        </div>
      </div>{/* end 2-col grid */}

      {/* ── Fleet Units — full width below map grid ──────────────────────── */}
      <FleetStatusCards
        units={FLEET}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      {/* ── Process — full width below fleet units ────────────────────────── */}
      <ProcessCard />

    </div>
  )
}
