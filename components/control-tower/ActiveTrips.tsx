// components/control-tower/ActiveTrips.tsx
import { Clock } from 'lucide-react'

// ── Mock data per tab ──────────────────────────────────────────────────────────
const CAMERA_THUMBS = [
  { id: '50-2355', src: '/images/control-tower/camera-monitor/trip1.jpg' },
  { id: '50-2358', src: '/images/control-tower/camera-monitor/trip2.jpg' },
  { id: '50-2361', src: '/images/control-tower/camera-monitor/trip3.jpg' },
  { id: '50-2364', src: '/images/control-tower/camera-monitor/trip4.jpg' },
]

const FORKLIFT_ITEMS = [
  { src: '/images/control-tower/forklift-tracking/trip5.jpg',  label: 'Forklift 32: Loading Area A', value: null     },
  { src: '/images/control-tower/forklift-tracking/trip6.jpg',  label: 'Forklift 31: Loading Area 2', value: '15 %'   },
  { src: '/images/control-tower/forklift-tracking/trip7.jpg',  label: 'Forklift 33: Loading Area B', value: '45 $'   },
  { src: '/images/control-tower/forklift-tracking/trip8.jpg',  label: 'Maintenance Convoy',          value: '50 %'   },
  { src: '/images/control-tower/forklift-tracking/trip9.jpg',  label: 'Average Speed: Round Dmn',   value: '24.1 %' },
]

const CAMERA_TRIPS = [
  { from: 'Blue Yard', to: 'MOTU',       id: '50-2355', mins: 4 },
  { from: 'Storage A', to: 'Dispatch',   id: '50-2359', mins: 7 },
  { from: 'Inspection',to: 'Green Yard', id: '50-2352', mins: 3 },
]

interface Props { activeTab: string }

export default function ActiveTrips({ activeTab }: Props) {
  if (activeTab === 'forklift') {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-[13px] font-semibold text-gray-800 mb-3">Active Trips</div>
        <div className="space-y-2">
          {FORKLIFT_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.label}
                className="w-[68px] h-[46px] rounded-lg object-cover flex-shrink-0 bg-gray-100"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-gray-700 truncate">{item.label}</div>
              </div>
              {item.value && (
                <div className="text-[11px] font-semibold text-gray-500 flex-shrink-0">{item.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Camera Monitor
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-[13px] font-semibold text-gray-800 mb-3">Active Trips</div>

      {/* 2×2 thumbnail grid */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {CAMERA_THUMBS.map(cam => (
          <div key={cam.id} className="relative rounded-lg overflow-hidden bg-gray-100" style={{ height: 72 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cam.src}
              alt={cam.id}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[9px] px-1.5 py-0.5">
              {cam.id}
            </div>
          </div>
        ))}
      </div>

      {/* Trip list */}
      <div className="space-y-2">
        {CAMERA_TRIPS.map(trip => (
          <div key={trip.id} className="flex items-center justify-between text-[11px]">
            <div className="text-gray-600">
              <span className="font-medium">{trip.from}</span>
              <span className="text-gray-400 mx-1">→</span>
              <span className="font-medium">{trip.to}</span>
            </div>
            <div className="text-gray-400 text-[10px] flex items-center gap-1">
              <Clock size={10} />
              {trip.mins} min
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
