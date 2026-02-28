'use client'

import { useState } from 'react'
import { Map, Layers } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ScenarioConfig from '@/components/simulator/ScenarioConfig'
import clsx from 'clsx'

const TABS = [
  { id: 'heatmap',  label: 'Plant Heatmap',              Icon: Map    },
  { id: 'stacking', label: 'Tube Stacking Simulation (AI)', Icon: Layers },
]

function HeatmapPlaceholder() {
  return (
    <div className="relative rounded-xl overflow-hidden h-[360px] bg-gray-800">
      {/* Simulated heatmap gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-yellow-400 via-green-400 via-cyan-400 to-blue-500 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(239,68,68,0.8)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(239,68,68,0.6)_0%,transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.4)_0%,transparent_60%)]" />

      {/* Legend */}
      <div className="absolute left-4 top-4 bottom-4 flex flex-col">
        <div className="h-full w-5 rounded" style={{
          background: 'linear-gradient(to bottom, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #3b82f6)'
        }} />
        <div className="absolute top-0 -right-16 space-y-3 text-[10px] text-white font-medium">
          <div>Max Activity</div>
          <div className="mt-3">High Activity tractor</div>
          <div className="mt-3">High Activity</div>
          <div className="mt-5">Medium</div>
          <div>Low</div>
          <div className="mt-3">Medium zkhrps (+0 min)</div>
          <div className="mt-3">Min Activity</div>
        </div>
      </div>

      {/* Map roads overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="2" />
        <line x1="40%" y1="0" x2="40%" y2="100%" stroke="white" strokeWidth="1.5" />
        <line x1="60%" y1="0" x2="55%" y2="100%" stroke="white" strokeWidth="1" />
      </svg>
    </div>
  )
}

function StackingPlaceholder() {
  return (
    <div className="relative rounded-xl overflow-hidden h-[360px] bg-gray-600">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
      {/* Simulated truck with tubes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/40 text-[13px]">[ Tube Stacking Simulation Placeholder ]</div>
          <div className="text-white/30 text-[11px] mt-1">Replace with actual 3D/simulation renderer</div>
        </div>
      </div>
      {/* Overlay annotations */}
      <div className="absolute top-4 right-4 space-y-1">
        {[
          'New Stability Score: 98.7 %',
          'Weight Dstribution: Balanced Balanced (+2%)',
          'Optimal Load Factor: 95 %',
          'Weight Detcor',
        ].map((txt, i) => (
          <div key={i} className="bg-black/50 text-white/80 text-[10px] px-2 py-0.5 rounded">{txt}</div>
        ))}
      </div>
    </div>
  )
}

export default function SimulatorPage() {
  const [activeTab, setActiveTab] = useState('heatmap')

  return (
    <div>
      <div className="flex items-start gap-6 mb-5">
        <div>
          <SectionHeader
            title="Digital Twin Simulator"
            subtitle="Validate improvements before implementation"
          />
        </div>
        <div className="flex border-b border-gray-200 mt-1">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 text-[13px] font-medium border-b-2 transition-colors mr-1',
                activeTab === id
                  ? 'border-[#1a237e] text-[#1a237e]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-4">
        <ScenarioConfig />
        <div>
          {activeTab === 'heatmap' ? <HeatmapPlaceholder /> : <StackingPlaceholder />}
        </div>
      </div>
    </div>
  )
}
