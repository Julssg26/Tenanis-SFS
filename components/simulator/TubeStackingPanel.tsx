// components/simulator/TubeStackingPanel.tsx
'use client'

import { useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'

const SCENARIOS = [
  'Reduce fleet by 1 tractor',
  'Optimize routing algorithm',
  'Redistribute zone assignments',
  'Adjust shift overlaps (+30 min)',
]

export default function TubeStackingPanel() {
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
        <div className="text-[14px] font-semibold text-gray-800 mb-1">Scenario Configuration</div>

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

      {/* Right — Tube stacking visualization */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden relative"
        style={{ minHeight: 380 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/simulator/tube-stacking/tubos.jpg"
          alt="Tube Stacking Simulation"
          className="w-full h-full object-cover"
          style={{ minHeight: 380 }}
        />

        {/* AI annotations overlay */}
        {completed && (
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
            {[
              'New Stability Score: 98.7%',
              'Weight Distribution: Balanced (+2%)',
              'Optimal Load Factor: 95%',
            ].map(txt => (
              <div key={txt}
                className="bg-black/55 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded">
                {txt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
