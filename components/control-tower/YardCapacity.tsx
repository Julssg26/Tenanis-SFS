import ProgressBar from '@/components/ui/ProgressBar'
import { YARD_CAPACITY } from '@/lib/mock-data'

interface StatItem { label: string; value: string }

const REAL_TIME_STATS: StatItem[] = [
  { label: 'Avg Cycle Time', value: '23 min' },
  { label: 'Active Units',   value: '12/15'  },
  { label: 'Pending Task',   value: '8'      },
  { label: 'Congestion',     value: '0.62'   },
]

export default function YardCapacity() {
  return (
    <>
      {/* Yard Capacity */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-[13px] font-semibold text-gray-800 mb-3">Yard Capacity</div>
        <div className="space-y-3">
          {YARD_CAPACITY.map(zone => (
            <div key={zone.name}>
              <div className="flex justify-between text-[12px] text-gray-600 mb-1">
                <span>{zone.name}</span>
                <span className="font-semibold">{zone.pct} %</span>
              </div>
              <ProgressBar value={zone.pct} showLabel={false} size="md" />
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Stats */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-[13px] font-semibold text-gray-800 mb-3">Real-Time Stats</div>
        <div className="grid grid-cols-2 gap-2">
          {REAL_TIME_STATS.map(s => (
            <div key={s.label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-[18px] font-bold text-gray-800">{s.value}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
