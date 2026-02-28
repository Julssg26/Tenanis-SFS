'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { ALGORITHM_WEIGHTS } from '@/lib/mock-data'

export default function AlgorithmWeights() {
  const [weights, setWeights] = useState(
    ALGORITHM_WEIGHTS.reduce((acc, w) => ({ ...acc, [w.key]: w.value }), {} as Record<string, number>)
  )

  const total = Object.values(weights).reduce((a, b) => a + b, 0)

  const update = (key: string, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-1">
        <SlidersHorizontal size={16} className="text-[#1a237e]" />
        <span className="text-[14px] font-semibold text-gray-800">Assignment Algorithm Weights</span>
      </div>
      <div className={`text-[12px] mb-4 ${total === 100 ? 'text-green-600' : 'text-red-500'}`}>
        Must total 100 % · Current: {total} %
      </div>

      <div className="space-y-5">
        {ALGORITHM_WEIGHTS.map(w => (
          <div key={w.key}>
            <div className="flex justify-between mb-2">
              <span className="text-[13px] text-gray-700">{w.label}</span>
              <span className="text-[13px] font-semibold text-gray-800">{weights[w.key]} %</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={weights[w.key]}
              onChange={e => update(w.key, Number(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
