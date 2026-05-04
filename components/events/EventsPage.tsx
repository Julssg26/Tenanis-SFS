// components/events/EventsPage.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, X, Filter, ChevronRight, Clock, Tag, Calendar, Cpu } from 'lucide-react'

// ── Mock event data — reuses images from Active Trips (Control Tower) ──────
const ALL_EVENTS = [
  {
    id: 'ev-001',
    src:      '/images/control-tower/camera-monitor/trip1.jpg',
    date:     '20/05/2024 10:15:23',
    assetId:  'TNZ-PLT-0012',
    duration: '2 min 34 sec',
    type:     'Unauthorized access',
    category: 'Alerts',
  },
  {
    id: 'ev-002',
    src:      '/images/control-tower/camera-monitor/trip2.jpg',
    date:     '19/05/2024 23:47:11',
    assetId:  'TNZ-PLT-0007',
    duration: '1 min 12 sec',
    type:     'Motion detected',
    category: 'Events',
  },
  {
    id: 'ev-003',
    src:      '/images/control-tower/forklift-tracking/trip5.jpg',
    date:     '19/05/2024 14:32:05',
    assetId:  'TNZ-PLT-0021',
    duration: '3 min 08 sec',
    type:     'Waste out of place',
    category: 'Alerts',
  },
  {
    id: 'ev-004',
    src:      '/images/control-tower/forklift-tracking/trip6.jpg',
    date:     '18/05/2024 09:08:45',
    assetId:  'TNZ-PLT-0015',
    duration: '2 min 01 sec',
    type:     'Unauthorized parking',
    category: 'Alerts',
  },
  {
    id: 'ev-005',
    src:      '/images/control-tower/camera-monitor/trip3.jpg',
    date:     '17/05/2024 16:22:10',
    assetId:  'TNZ-PLT-0033',
    duration: '0 min 47 sec',
    type:     'Forklift speed exceeded',
    category: 'Events',
  },
  {
    id: 'ev-006',
    src:      '/images/control-tower/forklift-tracking/trip7.jpg',
    date:     '17/05/2024 08:55:30',
    assetId:  'TNZ-PLT-0009',
    duration: '1 min 55 sec',
    type:     'Zone perimeter breach',
    category: 'Alerts',
  },
  {
    id: 'ev-007',
    src:      '/images/control-tower/camera-monitor/trip4.jpg',
    date:     '16/05/2024 21:03:44',
    assetId:  'TNZ-PLT-0028',
    duration: '4 min 12 sec',
    type:     'Equipment idle overtime',
    category: 'Events',
  },
  {
    id: 'ev-008',
    src:      '/images/control-tower/forklift-tracking/trip8.jpg',
    date:     '15/05/2024 11:41:09',
    assetId:  'TNZ-PLT-0044',
    duration: '1 min 38 sec',
    type:     'Operator missing PPE',
    category: 'Alerts',
  },
]

type Tab = 'All' | 'Events'

const TYPE_COLOR: Record<string, string> = {
  'Unauthorized access':     'text-red-600   bg-red-50   border-red-200',
  'Motion detected':         'text-blue-600  bg-blue-50  border-blue-200',
  'Waste out of place':      'text-amber-600 bg-amber-50 border-amber-200',
  'Unauthorized parking':    'text-red-600   bg-red-50   border-red-200',
  'Forklift speed exceeded': 'text-amber-600 bg-amber-50 border-amber-200',
  'Zone perimeter breach':   'text-red-600   bg-red-50   border-red-200',
  'Equipment idle overtime': 'text-blue-600  bg-blue-50  border-blue-200',
  'Operator missing PPE':    'text-red-600   bg-red-50   border-red-200',
}

type EventItem = typeof ALL_EVENTS[0]

export default function EventsPage() {
  const [activeTab,  setActiveTab ] = useState<Tab>('All')
  const [preview,    setPreview   ] = useState<EventItem | null>(null)

  const filtered = activeTab === 'All'
    ? ALL_EVENTS
    : ALL_EVENTS.filter(e => e.category === activeTab)

  // Close modal on Escape
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setPreview(null)
  }, [])
  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1a237e]">Events</h1>
          <p className="text-[13px] text-green-600 font-medium mt-0.5">
            Security & operational event monitoring — Tenaris Tamsa
          </p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter size={14}/>
          Filter
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {(['All','Events'] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-[13px] font-medium border-b-2 transition-colors mr-1 ${
              activeTab === tab
                ? 'border-[#1a237e] text-[#1a237e]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            <span className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {tab === 'All' ? ALL_EVENTS.length : ALL_EVENTS.filter(e => e.category === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="space-y-3">
        {filtered.map(ev => {
          const typeColor = TYPE_COLOR[ev.type] ?? 'text-gray-600 bg-gray-50 border-gray-200'
          return (
            <div key={ev.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-stretch overflow-hidden hover:shadow-md transition-shadow">

              {/* Thumbnail + Play */}
              <div className="relative flex-shrink-0 w-[160px] cursor-pointer group"
                onClick={() => setPreview(ev)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ev.src} alt={ev.type}
                  className="w-full h-full object-cover"
                  style={{ minHeight: 100 }}
                  onError={e => { (e.target as HTMLImageElement).style.background = '#1a237e20' }}
                />
                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"/>
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={18} className="text-[#1a237e] ml-0.5" fill="#1a237e"/>
                  </div>
                </div>
                {/* Timestamp overlay */}
                <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                  {ev.date.split(' ')[1]}
                </div>
              </div>

              {/* Event info */}
              <div className="flex-1 px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-2 items-center">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-gray-400 flex-shrink-0"/>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Date</div>
                    <div className="text-[13px] text-gray-800 font-medium">{ev.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu size={13} className="text-gray-400 flex-shrink-0"/>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Asset ID</div>
                    <div className="text-[13px] text-gray-800 font-mono font-medium">{ev.assetId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-gray-400 flex-shrink-0"/>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Event Duration</div>
                    <div className="text-[13px] text-gray-800 font-medium">{ev.duration}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-gray-400 flex-shrink-0"/>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Event Type</div>
                    <div className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${typeColor}`}>
                      {ev.type}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chevron */}
              <div className="flex items-center px-4 text-gray-300">
                <ChevronRight size={18}/>
              </div>
            </div>
          )
        })}
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <div className="text-[13px] font-bold text-[#1a237e]">Event Preview</div>
                <div className="text-[11px] text-gray-500">{preview.assetId} · {preview.type}</div>
              </div>
              <button onClick={() => setPreview(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X size={16} className="text-gray-600"/>
              </button>
            </div>

            {/* Modal image */}
            <div className="relative bg-gray-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.src} alt={preview.type}
                className="w-full object-cover" style={{ maxHeight: 420 }}/>
              {/* Centered play indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center">
                  <Play size={28} className="text-white ml-1" fill="white"/>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="grid grid-cols-4 divide-x divide-gray-100 border-t border-gray-100">
              {[
                { icon: Calendar, label: 'Date',     value: preview.date     },
                { icon: Cpu,      label: 'Asset ID', value: preview.assetId  },
                { icon: Clock,    label: 'Duration', value: preview.duration },
                { icon: Tag,      label: 'Type',     value: preview.type     },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="px-4 py-3 text-center">
                  <Icon size={13} className="text-[#1a237e] mx-auto mb-1"/>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">{label}</div>
                  <div className="text-[11px] text-gray-800 font-medium mt-0.5">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
