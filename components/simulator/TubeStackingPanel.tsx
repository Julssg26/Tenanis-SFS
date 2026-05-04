'use client'


import { useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import TubeStackingViewer from './TubeStackingViewer'

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
    setRunning(true); setCompleted(false)
    setTimeout(() => { setRunning(false); setCompleted(true) }, 3000)
  }
  function reset() { setRunning(false); setCompleted(false) }

  return (
    <div className="grid grid-cols-[280px_1fr] gap-4 p-4">

      {/* Left — Scenario Configuration */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="text-[13px] font-semibold text-gray-800 mb-1">Scenario Configuration</div>
        {SCENARIOS.map(s => (
          <div key={s} className="text-[11px] text-gray-600 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
            {s}
          </div>
        ))}
        <button
          onClick={running ? reset : runSim}
          className={`w-full flex items-center justify-center gap-2 text-white text-[13px] font-semibold rounded-xl py-2.5 mt-2 transition-colors ${
            running ? 'bg-gray-500 hover:bg-gray-600' : 'bg-[#1a237e] hover:bg-[#283593]'
          }`}
        >
          {running ? <><Pause size={14}/> Stop</> : <><Play size={14}/> Run Simulation</>}
        </button>
        {completed && (
          <button onClick={reset} className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-[12px] py-1">
            <RotateCcw size={12}/> Reset
          </button>
        )}
      </div>

      {/* Right — 3D interactive viewer */}
      <div style={{ minHeight: 480 }}>
        <TubeStackingViewer />
      </div>

    </div>
  )
}