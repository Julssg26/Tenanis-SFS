'use client'

import dynamic from 'next/dynamic'
import { Camera, Truck } from 'lucide-react'

const OLMap = dynamic(() => import('./OLMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-gray-100 flex items-center justify-center" style={{ height: 500 }}>
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
        </svg>
        <span className="text-[13px]">Loading map…</span>
      </div>
    </div>
  ),
})

const TABS = [
  { id: 'camera',   label: 'Camera Monitor',   Icon: Camera },
  { id: 'forklift', label: 'Forklift Tracking', Icon: Truck  },
]

const CAMERA_LEGEND = [
  { color: '#3b82f6', label: 'Blue Yard → MOTU'       },
  { color: '#16a34a', label: 'Storage A → Dispatch'    },
  { color: '#eab308', label: 'Inspection → Green Yard' },
]

const FORKLIFT_LEGEND = [
  { color: '#16a34a', label: 'Active'   },
  { color: '#eab308', label: 'Loading'  },
  { color: '#ef4444', label: 'Idle'     },
  { color: '#dc2626', label: 'Critical' },
]

interface MapPlaceholderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MapPlaceholder({ activeTab, onTabChange }: MapPlaceholderProps) {
  const legend = activeTab === 'forklift' ? FORKLIFT_LEGEND : CAMERA_LEGEND

  return (
    // ⚠️ NO overflow-hidden here — OL canvas must not be clipped
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Tabs + legend */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 pt-3 pb-0">
        <div className="flex">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium border-b-2 transition-colors mr-2 ${
                activeTab === id
                  ? 'border-[#1a237e] text-[#1a237e]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 pb-2">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
              <span className="text-[11px] text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map — rendered in its own div with explicit height */}
      <OLMap activeTab={activeTab} />
    </div>
  )
}
