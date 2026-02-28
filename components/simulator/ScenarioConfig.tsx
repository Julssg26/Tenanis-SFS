'use client'

import { useState } from 'react'
import { Play, FlaskConical } from 'lucide-react'

const SCENARIOS = [
  'Reduce fleet by 1 tractor',
  'Optimize routing algoritm',
  'Redistribute zone assignments',
  'Adjust shift overlaps (+30 min)',
]

export default function ScenarioConfig() {
  const [selected, setSelected] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  const toggle = (s: string) =>
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const runSim = () => {
    setRunning(true)
    setTimeout(() => setRunning(false), 2500)
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical size={16} className="text-[#1a237e]" />
        <span className="text-[14px] font-semibold text-gray-800">Scenario Configuration</span>
      </div>
      <div className="text-[11px] text-gray-400 mb-4">Select scenarios to simulate</div>

      <div className="space-y-2 mb-5">
        {SCENARIOS.map(s => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`w-full text-left border rounded-lg px-4 py-3 text-[13px] transition-colors ${
              selected.includes(s)
                ? 'border-[#1a237e] bg-[#1a237e]/5 text-[#1a237e] font-medium'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={runSim}
        disabled={running || selected.length === 0}
        className="w-full bg-[#1a237e] text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-[#283593] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play size={15} fill="white" />
        {running ? 'Running...' : 'Run Simulation'}
      </button>

      {running && (
        <div className="mt-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1a237e] rounded-full animate-[progress_2.5s_linear_forwards]" />
          </div>
          <div className="text-[11px] text-center text-gray-500 mt-1">Processing simulation...</div>
        </div>
      )}
    </div>
  )
}
