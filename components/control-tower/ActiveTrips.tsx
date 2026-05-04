// components/control-tower/ActiveTrips.tsx
import { Clock } from 'lucide-react'

const FORKLIFT_ITEMS = [
  { label: 'Forklift 32: Loading Area A', value: null      },
  { label: 'Forklift 31: Loading Area 2', value: '15 %'    },
  { label: 'Forklift 33: Loading Area B', value: '45 $'    },
  { label: 'Maintenance Convoy',          value: '50 %'    },
  { label: 'Average Speed: Round Dmn',    value: '24.1 %'  },
]

// Camera Monitor (Truck Tracking) — extended list fills column
const CAMERA_TRIPS = [
  { from: 'Blue Yard',    to: 'MOTU',        id: '50-2355', mins: 4 },
  { from: 'Storage A',    to: 'Dispatch',    id: '50-2359', mins: 7 },
  { from: 'Inspection',   to: 'Green Yard',  id: '50-2352', mins: 3 },
  { from: 'MOTU',         to: 'Gate',        id: '50-2371', mins: 5 },
 
  
]

interface Props { activeTab: string }

export default function ActiveTrips({ activeTab }: Props) {
  if (activeTab === 'forklift') {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-[13px] font-semibold text-gray-800 mb-3">Active Trips</div>
        <div className="space-y-2">
          {FORKLIFT_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="text-[11px] font-medium text-gray-700 truncate flex-1 min-w-0">
                {item.label}
              </div>
              {item.value && (
                <div className="text-[11px] font-semibold text-gray-500 flex-shrink-0 ml-2">
                  {item.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Truck Tracking (camera) — 7 trips, no thumbnails
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-[13px] font-semibold text-gray-800 mb-3">Active Trips</div>
      <div className="space-y-0">
        {CAMERA_TRIPS.map((trip, i) => (
          <div key={trip.id}
            className={`flex items-center justify-between py-2.5 text-[11px] ${
              i < CAMERA_TRIPS.length - 1 ? 'border-b border-gray-50' : ''
            }`}>
            <div className="flex flex-col gap-0.5">
              <div className="text-gray-700">
                <span className="font-medium">{trip.from}</span>
                <span className="text-gray-400 mx-1">→</span>
                <span className="font-medium">{trip.to}</span>
              </div>
              <div className="text-[9px] text-gray-400 font-mono">{trip.id}</div>
            </div>
            <div className="text-gray-400 text-[10px] flex items-center gap-1 flex-shrink-0 ml-3">
              <Clock size={10} />
              {trip.mins} min
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
