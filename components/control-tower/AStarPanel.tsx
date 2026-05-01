'use client'

import { useState } from 'react'
import { YARD_LABELS, YARD_GRAPH } from '@/lib/routing/yardGraph'
import { aStar } from '@/lib/routing/aStar'
import { Navigation, RotateCcw } from 'lucide-react'

interface AStarPanelProps {
  /** Called when a valid path is computed */
  onRoute: (nodeIds: string[]) => void
  /** Called when the user clears the route */
  onClear: () => void
}

const NODE_IDS = Object.keys(YARD_LABELS)

export default function AStarPanel({ onRoute, onClear }: AStarPanelProps) {
  const [origin, setOrigin]      = useState<string>('LOADING_BAY')
  const [dest,   setDest]        = useState<string>('MOTU')
  const [result, setResult]      = useState<string | null>(null)
  const [error,  setError]       = useState<string | null>(null)

  function compute() {
    setError(null)
    const path = aStar(YARD_GRAPH, origin, dest)
    if (!path || path.length < 2) {
      setError('No route found between selected zones.')
      setResult(null)
      onClear()
      return
    }
    const labels = path.map(id => YARD_LABELS[id]).join(' → ')
    setResult(labels)
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
        {/* Origin */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-gray-500 font-medium">Origin</label>
          <select
            value={origin}
            onChange={e => { setOrigin(e.target.value); clear() }}
            className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white outline-none focus:border-[#1a237e]"
          >
            {NODE_IDS.map(id => (
              <option key={id} value={id}>{YARD_LABELS[id]}</option>
            ))}
          </select>
        </div>

        <span className="text-gray-400 text-[13px] mb-1.5">→</span>

        {/* Destination */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-gray-500 font-medium">Destination</label>
          <select
            value={dest}
            onChange={e => { setDest(e.target.value); clear() }}
            className="text-[12px] border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white outline-none focus:border-[#1a237e]"
          >
            {NODE_IDS.map(id => (
              <option key={id} value={id}>{YARD_LABELS[id]}</option>
            ))}
          </select>
        </div>

        {/* Compute */}
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
