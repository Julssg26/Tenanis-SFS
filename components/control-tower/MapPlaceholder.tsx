'use client'

import dynamic from 'next/dynamic'
import { useRef, useState, useEffect } from 'react'
import { Camera, Truck, Route } from 'lucide-react'
import PlantHeatmapPanel  from '@/components/simulator/PlantHeatmapPanel'
import TubeStackingPanel  from '@/components/simulator/TubeStackingPanel'
import AStarPanel         from './AStarPanel'
import FleetStatusCards   from './FleetStatusCards'
import ActiveTrips        from './ActiveTrips'
import YardCapacity       from './YardCapacity'
import ProcessCard        from './ProcessCard'
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

// Custom icon component for Tube Stacking PNG
function TubesIcon({ size = 14 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/icons/Tubes.png" alt="Tubes" width={size} height={size}
      style={{ objectFit: 'contain', display: 'inline-block' }} />
  )
}

const TABS: Array<{ id: string; label: string; Icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'camera',   label: 'Truck Tracking',    Icon: Camera      },
  { id: 'forklift', label: 'Forklift Tracking', Icon: Truck       },
  { id: 'heatmap',  label: 'Trips Simulators',  Icon: Route       },
  { id: 'stacking', label: 'Tube Stacking',     Icon: TubesIcon   },
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
  activeTab:     string
  onTabChange:   (tab: string) => void
  initialUnitId?: string | null
}

export default function MapPlaceholder({ activeTab, onTabChange, initialUnitId }: Props) {
  const olMapRef = useRef<OLMapHandle>(null)
  const [selectedId, setSelectedId] = useState<string | null>(initialUnitId ?? null)

  useEffect(() => {
    if (!initialUnitId) return
    setSelectedId(initialUnitId)
    setTimeout(() => {
      olMapRef.current?.highlightUnit(initialUnitId)
      olMapRef.current?.centerOnUnit(initialUnitId)
    }, 800)
  }, [initialUnitId])

  const isMapTab = activeTab === 'camera' || activeTab === 'forklift'
  const legend   = activeTab === 'forklift' ? FORKLIFT_LEGEND : CAMERA_LEGEND

  function handleSelect(id: string) {
    const next = selectedId === id ? null : id
    setSelectedId(next)
    olMapRef.current?.highlightUnit(next)
    if (next) olMapRef.current?.centerOnUnit(next)
  }

  // ── Shared map card ────────────────────────────────────────────────────────
  const mapCard = (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
        {isMapTab && (
          <div className="flex items-center gap-2 pb-2 flex-wrap">
            {legend.map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'camera' && (
        <div className="px-4 pt-3">
          <AStarPanel
            onRoute={ids => olMapRef.current?.drawRoute(ids)}
            onClear={() => olMapRef.current?.clearRoute()}
          />
        </div>
      )}

      {isMapTab && (
        <OLMap
          ref={olMapRef}
          activeTab={activeTab}
          selectedUnitId={selectedId}
          onUnitClick={handleSelect}
        />
      )}

      {activeTab === 'heatmap'  && <PlantHeatmapPanel />}
      {activeTab === 'stacking' && <TubeStackingPanel />}
    </div>
  )

  // ── Simulator tabs ─────────────────────────────────────────────────────────
  if (!isMapTab) {
    return <div className="min-w-0">{mapCard}</div>
  }

  // ── Operational tabs (Truck + Forklift) ────────────────────────────────────
  //
  //  Structure matching the reference image:
  //
  //  ┌─────────────────────────── MAP ──────────────────────┐ ┌─ SIDEBAR ─┐
  //  │  (mapa satelital + tabs + A* si aplica)               │ │ ActiveT.  │
  //  └──────────────────────────────────────────────────────┘ │ Yard Cap. │
  //  ┌──────────────── FLEET UNITS (full width) ─────────────────────────────┐
  //  └───────────────────────────────────────────────────────────────────────┘
  //  ┌──────────────── PROCESS (full width) ─────────────────────────────────┐
  //  └───────────────────────────────────────────────────────────────────────┘
  //
  // Key: the sidebar is ONLY next to the map. Fleet Units and Process are
  // completely outside any column structure — they are block-level children
  // of the outer wrapper and naturally take 100% width.
  //
  return (
    <div className="space-y-4 min-w-0">

      {/* Row 1: map + sidebar side by side */}
      <div className="flex gap-4 items-start min-w-0">
        {/* Map — takes all remaining width */}
        <div className="min-w-0" style={{ flex: '1 1 0%' }}>
          {mapCard}
        </div>
        {/* Sidebar — fixed width, only here in row 1 */}
        <div className="space-y-4 flex-shrink-0" style={{ width: '280px' }}>
          <ActiveTrips activeTab={activeTab} />
          <YardCapacity />
        </div>
      </div>

      {/* Row 2: Fleet Units — naturally 100% of outer wrapper width */}
      <FleetStatusCards
        units={FLEET}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      {/* Row 3: Process — naturally 100% of outer wrapper width */}
      <ProcessCard />

    </div>
  )
}
