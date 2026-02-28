'use client'

import { Camera, Truck } from 'lucide-react'

const TABS = [
  { id: 'camera',   label: 'Camera Monitor',   Icon: Camera },
  { id: 'forklift', label: 'Forklift Tracking', Icon: Truck  },
]

const VEHICLES = [
  { x: 22, y: 38, color: '#3b82f6', status: 'active'   },
  { x: 35, y: 55, color: '#ef4444', status: 'idle'     },
  { x: 50, y: 35, color: '#eab308', status: 'loading'  },
  { x: 55, y: 42, color: '#eab308', status: 'loading'  },
  { x: 67, y: 55, color: '#ef4444', status: 'critical' },
  { x: 42, y: 68, color: '#16a34a', status: 'active'   },
  { x: 58, y: 72, color: '#16a34a', status: 'active'   },
  { x: 28, y: 70, color: '#3b82f6', status: 'active'   },
]

interface MapPlaceholderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function MapPlaceholder({ activeTab, onTabChange }: MapPlaceholderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 pt-3">
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

      {/* Map area */}
      <div className="relative bg-[#e8eed8] overflow-hidden" style={{ height: 520 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#7a9b5a] via-[#4a7a3a] to-[#1a4a8a] opacity-70" />

        {/* Zone labels */}
        <div className="absolute top-[28%] left-[38%] bg-[#1a237e]/80 text-white text-[11px] font-bold px-3 py-1 rounded">UT 31</div>
        <div className="absolute top-[36%] left-[34%] bg-[#1a237e]/80 text-white text-[11px] font-bold px-3 py-1 rounded">UT 32</div>
        <div className="absolute top-[26%] left-[52%] bg-[#1a237e]/80 text-white text-[11px] font-bold px-3 py-1 rounded">PREM 31</div>
        <div className="absolute top-[24%] left-[20%] bg-[#1a237e]/80 text-white text-[11px] font-bold px-2 py-1 rounded">M 31</div>
        <div className="absolute top-[36%] left-[15%] bg-[#1a237e]/80 text-white text-[11px] font-bold px-2 py-1 rounded">M 32</div>
        <div className="absolute top-[20%] right-[8%] bg-[#1a237e]/80 text-white text-[11px] font-bold px-2 py-1 rounded rotate-90">4TOP</div>

        {/* Vehicle pins — always visible */}
        {VEHICLES.map((v, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${v.x}%`, top: `${v.y}%` }}
          >
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                style={{ background: v.color }}
              >
                <Truck size={13} className="text-white" />
              </div>
              {v.status === 'critical' && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border border-white rounded-full" />
              )}
            </div>
          </div>
        ))}

        {/* Forklift tracking lines — only on forklift tab */}
        {activeTab === 'forklift' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="22%" y1="38%" x2="50%" y2="35%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
            <line x1="50%" y1="35%" x2="67%" y2="55%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
            <line x1="42%" y1="68%" x2="55%" y2="42%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
            <line x1="28%" y1="70%" x2="35%" y2="55%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
            {[
              [22,38],[50,35],[67,55],[42,68],[55,42],[28,70],[35,55],[58,72]
            ].map(([x,y], i) => (
              <circle key={i} cx={`${x}%`} cy={`${y}%`} r="5" fill="#eab308" stroke="white" strokeWidth="1.5" />
            ))}
          </svg>
        )}

        <div className="absolute top-4 right-[28%] text-white/60 text-[13px] font-bold">900</div>
        <div className="absolute bottom-[28%] left-[38%] text-white/60 text-[13px] font-bold">800</div>
      </div>
    </div>
  )
}
