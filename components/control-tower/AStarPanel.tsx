'use client'

import { useState } from 'react'
import { YARD_LABELS, YARD_GRAPH, ZONE_NODE_IDS, nearestNode } from '@/lib/routing/yardGraph'
import { aStar } from '@/lib/routing/aStar'
import { getMockFleet } from '@/lib/fleet/mockFleet'
import { Navigation, RotateCcw } from 'lucide-react'

interface AStarPanelProps {
  onRoute: (nodeIds: string[]) => void
  onClear: () => void
}

// Destination zone options (no intersection nodes in UI)
const DEST_IDS = ZONE_NODE_IDS

// Fleet units for origin selector
const FLEET = getMockFleet()

export default function AStarPanel({ onRoute, onClear }: AStarPanelProps) {
  const [unitId, setUnitId] = useState<string>(FLEET[0]?.id ?? '')
  const [dest,   setDest  ] = useState<string>('MOTU')
  const [result, setResult] = useState<string | null>(null)
  const [error,  setError ] = useState<string | null>(null)

  function compute() {
    setError(null)

    // Find selected unit and its current coordinates
    const unit = FLEET.find(u => u.id === unitId)
    if (!unit) {
      setError('No unit selected.')
      return
    }

    const [lon, lat] = unit.coordinates

    // Snap unit position to nearest road node
    const originNode = nearestNode(lon, lat)

    // Run A* from nearest road node to destination zone
    const path = aStar(YARD_GRAPH, originNode, dest)

    if (!path || path.length < 2) {
      setError(`No route found from ${unit.name} to ${YARD_LABELS[dest]}.`)
      setResult(null)
      onClear()
      return
    }

    // Build human-readable route label (skip intermediate intersection nodes)
    const readableStops = path
      .filter(id => ZONE_NODE_IDS.includes(id) || id === originNode)
      .map(id => YARD_LABELS[id] ?? id)
    const label = readableStops.length > 1
      ? readableStops.join(' → ')
      : `${unit.name} → ${YARD_LABELS[dest]}`

    setResult(`${unit.name}: ${label}`)
    onRoute(path)
  }

  function clear() {
    setResult(null)
    setError(null)
    onClear()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Navigation size={15} className="text-[#1a237e]" />
        <span className="text-[13px] font-semibold text-[#1a237e]">A* Route Planner</span>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {/* Unit / Equipment selector (origin) */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-gray-500 font-medium">Unit / Equipment</label>
          <select
            value={unitId}
            onChange={e => { setUnitId(e.target.value); clear() }}
            className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white outline-none focus:border-[#1a237e]"
          >
            {FLEET.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.currentZone}
              </option>
            ))}
          </select>
        </div>

        <span className="text-gray-400 text-[13px] mb-1.5">→</span>

        {/* Destination zone */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-gray-500 font-medium">Destination</label>
          <select
            value={dest}
            onChange={e => { setDest(e.target.value); clear() }}
            className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white outline-none focus:border-[#1a237e]"
          >
            {DEST_IDS.map(id => (
              <option key={id} value={id}>{YARD_LABELS[id]}</option>
            ))}
          </select>
        </div>

        {/* Calculate */}
        <button
          onClick={compute}
          className="flex items-center gap-1.5 bg-[#1a237e] text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#283593] transition-colors mb-0.5"
        >
          <Navigation size={13} />
          Calculate
        </button>

        {/* Clear */}
        {(result || error) && (
          <button
            onClick={clear}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-[12px] px-2 py-1.5 rounded-lg transition-colors mb-0.5"
          >
            <RotateCcw size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-3 bg-[#e8f5e9] border border-[#a5d6a7] rounded-lg px-3 py-2 text-[12px] text-[#1b5e20] font-medium">
          ✓ {result}
        </div>
      )}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[12px] text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}

