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
    <div className="relative rounded-xl overflow-hidden bg-gray-900 shadow-sm" style={{ aspectRatio: '16/9' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/simulator/plant-heatmap/heatmap.jpg"
        alt="Plant heatmap"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )
}

function StackingPlaceholder() {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-900 shadow-sm" style={{ aspectRatio: '16/9' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/simulator/tube-stacking/tubos.jpg"
        alt="Tube Stacking Simulation"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Annotation overlays — matching Figma */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
        <div className="bg-black/50 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded">
          New Stability Score: 98.7%
        </div>
        <div className="bg-black/50 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded">
          Weight Distribution: Balanced (+2%)
        </div>
        <div className="bg-black/50 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded">
          Optimal Load Factor: 95%
        </div>
        <div className="bg-black/50 backdrop-blur-sm text-white/90 text-[11px] font-medium px-2.5 py-1 rounded">
          Weight Detector
        </div>
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
