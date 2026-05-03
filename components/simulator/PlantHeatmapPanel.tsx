// components/simulator/PlantHeatmapPanel.tsx
'use client'

import { useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'

const SCENARIOS = [
  'Reduce fleet by 1 tractor',
  'Optimize routing algorithm',
  'Redistribute zone assignments',
  'Adjust shift overlaps (+30 min)',
]

export default function PlantHeatmapPanel() {
  const [running,   setRunning  ] = useState(false)
  const [completed, setCompleted] = useState(false)

  function runSim() {
    setRunning(true)
    setCompleted(false)
    setTimeout(() => { setRunning(false); setCompleted(true) }, 2500)
  }

  function reset() { setRunning(false); setCompleted(false) }

  return (
    <div className="grid grid-cols-[280px_1fr] gap-4 p-4">
      {/* Left — Scenario Configuration */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[14px] font-semibold text-gray-800">Scenario Configuration</span>
        </div>

        {SCENARIOS.map(s => (
          <div key={s}
            className="text-[12px] text-gray-600 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            {s}
          </div>
        ))}

        <button
          onClick={runSim}
          disabled={running}
          className="w-full flex items-center justify-center gap-2 bg-[#1a237e] hover:bg-[#283593] text-white text-[13px] font-semibold rounded-xl py-2.5 mt-2 transition-colors disabled:opacity-60"
        >
          {running
            ? <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/></svg> Running…</>
            : <><Play size={14} /> Run Simulation</>
          }
        </button>

        {completed && (
          <button onClick={reset}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-[12px] py-1 transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Right — Heatmap visualization */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden relative"
        style={{ minHeight: 380 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/simulator/plant-heatmap/heatmap.jpg"
          alt="Plant Heatmap"
          className="w-full h-full object-cover"
          style={{ minHeight: 380 }}
        />

        {/* Legend overlay */}
        <div className="absolute left-4 top-4 flex flex-col gap-1 bg-black/40 backdrop-blur-sm rounded-lg p-2">
          {[
            { color: '#dc2626', label: 'Max Activity'        },
            { color: '#f97316', label: 'High Activity tractor'},
            { color: '#eab308', label: 'High Activity'       },
            { color: '#22c55e', label: 'Medium'              },
            { color: '#3b82f6', label: 'Low'                 },
            { color: '#6366f1', label: 'Min Activity'        },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color }} />
              <span className="text-[10px] text-white">{label}</span>
            </div>
          ))}
        </div>

        {completed && (
          <div className="absolute top-4 right-4 bg-green-600/90 text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg">
            ✓ Simulation complete
          </div>
        )}
      </div>
    </div>
  )
}
