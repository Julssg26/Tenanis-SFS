'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import MapPlaceholder from '@/components/control-tower/MapPlaceholder'
import ActiveTrips from '@/components/control-tower/ActiveTrips'
import YardCapacity from '@/components/control-tower/YardCapacity'
import ProcessCard from '@/components/control-tower/ProcessCard'

const FILTER_CHIPS = [
  { label: 'Active',            color: '#16a34a' },
  { label: 'Loading/Unloading', color: '#eab308' },
  { label: 'Idle',              color: '#f97316' },
  { label: 'Excesive Idle',     color: '#ef4444' },
  { label: 'Maintenance',       color: '#6366f1' },
]

export default function ControlTowerPage() {
  // Single source of truth for the active tab — shared by map + sidebar
  const [activeTab, setActiveTab] = useState('camera')

  return (
    <div>
      <div className="flex items-start justify-between mb-5">
        <SectionHeader
          title="Control Tower"
          subtitle="Live fleet positioning - Plant Overview"
        />
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <button className="flex items-center gap-1.5 bg-[#1a237e] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg">
            <Filter size={12} />
            Filters
          </button>
          {FILTER_CHIPS.map(chip => (
            <div
              key={chip.label}
              className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] text-gray-700"
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: chip.color }} />
              {chip.label}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-4">
        {/* Left column: Map + Process card below */}
        <div className="flex flex-col gap-4">
          <MapPlaceholder activeTab={activeTab} onTabChange={setActiveTab} />
          <ProcessCard />
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <ActiveTrips activeTab={activeTab} />
          <YardCapacity />
        </div>
      </div>
    </div>
  )
}
