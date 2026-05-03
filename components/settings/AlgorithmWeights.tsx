'use client'

import { useState } from 'react'
import { ALGORITHM_WEIGHTS } from '@/lib/mock-data'

export default function AlgorithmWeights() {
  const [weights, setWeights] = useState(() => ALGORITHM_WEIGHTS.map(w => ({ ...w })))

  function update(key: string, val: number) {
    setWeights(prev => prev.map(w => w.key === key ? { ...w, value: val } : w))
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="text-[14px] font-semibold text-gray-800 mb-1">
        Assignment Algorithm Weights
      </div>
      <div className="text-[12px] text-gray-500 mb-4">
        Routing priority factors
      </div>
      <div className="space-y-4">
        {weights.map(w => (
          <div key={w.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-gray-700">{w.label}</span>
              <span className="text-[13px] font-bold text-green-600">{w.value}%</span>
            </div>
            <input
              type="range" min={0} max={60} step={1}
              value={w.value}
              onChange={e => update(w.key, Number(e.target.value))}
              className="w-full h-1.5 accent-green-600 cursor-pointer"
            />
          </div>
        ))}
        <p className="text-[10px] text-gray-400 pt-1">
          Total: <strong>{weights.reduce((s, w) => s + w.value, 0)}%</strong>
          {weights.reduce((s, w) => s + w.value, 0) !== 100 &&
            <span className="text-amber-500 ml-1">⚠ Should sum to 100</span>}
        </p>
      </div>
    </div>
  )
}
