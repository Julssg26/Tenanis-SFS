import { Clock, ArrowRight } from 'lucide-react'
import { ACTIVE_TRIPS } from '@/lib/mock-data'

// ─── Camera Monitor sidebar ───────────────────────────────────────────────────
const CAMERA_THUMBS = [
  { src: '/images/control-tower/camera-monitor/trip1.jpg', id: '50-2355' },
  { src: '/images/control-tower/camera-monitor/trip2.jpg', id: '50-2359' },
  { src: '/images/control-tower/camera-monitor/trip3.jpg', id: '50-2352' },
  { src: '/images/control-tower/camera-monitor/trip4.jpg', id: '50-2354' },
]

function CameraMonitorSidebar() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-[13px] font-semibold text-gray-800 mb-3">Active Trips</div>

      {/* 2×2 camera grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {CAMERA_THUMBS.map((cam) => (
          <div key={cam.id} className="relative rounded-lg overflow-hidden h-[80px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cam.src}
              alt={cam.id}
              className="w-full h-full object-cover"
            />
            {/* ID label overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-1.5 py-0.5">
              <span className="text-[10px] text-white/90 font-mono">{cam.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trip list */}
      <div className="space-y-2">
        {ACTIVE_TRIPS.map((trip, i) => (
          <div key={i} className="border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-700">
                <span>{trip.from}</span>
                <ArrowRight size={12} className="text-gray-400" />
                <span>{trip.to}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#1a237e] font-semibold">
                <Clock size={11} />
                {trip.etaMin} min
              </div>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">{trip.unitId}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Forklift Tracking sidebar ────────────────────────────────────────────────
// Matches Figma exactly: thumbnail left (small), label + value right, then trip rows
const FORKLIFT_ITEMS = [
  { src: '/images/control-tower/forklift-tracking/trip5.jpg', label: 'Forklift 32: Loading Area A', value: null   },
  { src: '/images/control-tower/forklift-tracking/trip6.jpg', label: 'Forklift 31: Loading Area 2', value: '15 %' },
  { src: '/images/control-tower/forklift-tracking/trip7.jpg', label: 'Forklift 33: Loading Area B', value: '45 %' },
  { src: '/images/control-tower/forklift-tracking/trip8.jpg', label: 'Maintenance Comboy',           value: '50 %' },
  { src: '/images/control-tower/forklift-tracking/trip9.jpg', label: 'Average Speed: Round Dmn',     value: '24.1 %' },
]

function ForkliftTrackingSidebar() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-[13px] font-semibold text-gray-800 mb-3">Active Trips</div>

      {/* Forklift list — thumbnail + label + value */}
      <div className="space-y-2 mb-4">
        {FORKLIFT_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className="w-[68px] h-[46px] rounded-lg overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Label + value */}
            <div className="flex-1 flex items-center justify-between min-w-0">
              <span className="text-[12px] text-gray-700 leading-tight line-clamp-2">{item.label}</span>
              {item.value && (
                <span className="text-[12px] font-semibold text-gray-600 ml-2 flex-shrink-0">{item.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trip rows (same as camera tab) */}
      <div className="space-y-2">
        {ACTIVE_TRIPS.map((trip, i) => (
          <div key={i} className="border border-gray-100 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-700">
                <span>{trip.from}</span>
                <ArrowRight size={12} className="text-gray-400" />
                <span>{trip.to}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#1a237e] font-semibold">
                <Clock size={11} />
                {trip.etaMin} min
              </div>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">{trip.unitId}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────
interface ActiveTripsProps {
  activeTab: string
}

export default function ActiveTrips({ activeTab }: ActiveTripsProps) {
  return activeTab === 'forklift'
    ? <ForkliftTrackingSidebar />
    : <CameraMonitorSidebar />
}

