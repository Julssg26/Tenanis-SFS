import { Clock, ArrowRight } from 'lucide-react'
import { ACTIVE_TRIPS } from '@/lib/mock-data'

// ─── Camera Monitor sidebar ───────────────────────────────────────────────────
const CAM_COLORS = ['#374151', '#1e3a5f', '#1a3a2a', '#2a1a1a']
const CAM_IDS    = ['50-2355', '50-2359', '50-2352', '50-2354']

function CameraMonitorSidebar() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-[13px] font-semibold text-gray-800 mb-3">Active Trips</div>

      {/* Camera thumbnails */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {CAM_IDS.map((id, i) => (
          <div
            key={id}
            className="rounded-lg overflow-hidden relative h-[72px]"
            style={{ background: CAM_COLORS[i] }}
          >
            <div className="absolute bottom-1 left-1.5 text-white/80 text-[10px] font-mono">{id}</div>
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-8 h-8 border-2 border-white rounded" />
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
const FORKLIFT_ITEMS = [
  { label: 'Forklift 32: Loading Area A', pct: null,  img: '#374151' },
  { label: 'Forklift 31: Loading Area 2', pct: '15 %', img: '#1e3a2a' },
  { label: 'Forklift 33: Loading Area B', pct: '45 $', img: '#2a1a3a' },
  { label: 'Maintenance Comboy',          pct: '50 %', img: '#1a2a3a' },
  { label: 'Average Speed: Round Dmn',    pct: '24.1 %', img: '#2a2a1a' },
]

function ForkliftTrackingSidebar() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-[13px] font-semibold text-gray-800 mb-3">Active Trips</div>

      {/* Forklift list with thumbnail */}
      <div className="space-y-2 mb-4">
        {FORKLIFT_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Thumbnail */}
            <div
              className="w-16 h-11 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
              style={{ background: item.img }}
            >
              <div className="w-6 h-6 border border-white/30 rounded opacity-40" />
            </div>
            {/* Label + pct */}
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[12px] text-gray-700 leading-tight">{item.label}</span>
              {item.pct && (
                <span className="text-[12px] font-semibold text-gray-600 ml-2 shrink-0">{item.pct}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trip rows */}
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
