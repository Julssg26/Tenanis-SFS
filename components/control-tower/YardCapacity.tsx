// components/control-tower/YardCapacity.tsx
import ProgressBar from '@/components/ui/ProgressBar'

interface Zone { name: string; pct: number }

// Only Blue Yard and Green Yard (as per previous design decision)
const YARD_ZONES: Zone[] = [
  { name: 'Blue Yard',  pct: 82 },
  { name: 'Green Yard', pct: 45 },
]

const REAL_TIME_STATS = [
  { label: 'Avg Cycle Time', value: '23 min' },
  { label: 'Active Units',   value: '12/15'  },
  { label: 'Pending Tasks',  value: '8'      },
  { label: 'Congestion',     value: '0.62'   },
]

// Inline progress bar if ProgressBar component doesn't exist in target repo
function Bar({ pct }: { pct: number }) {
  const color = pct >= 75 ? 'bg-red-500' : pct >= 50 ? 'bg-amber-400' : 'bg-green-500'
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function YardCapacity() {
  return (
    <>
      {/* Yard Capacity */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-[13px] font-semibold text-gray-800 mb-3">Yard Capacity</div>
        <div className="space-y-3">
          {YARD_ZONES.map(zone => (
            <div key={zone.name}>
              <div className="flex justify-between text-[12px] text-gray-600 mb-1">
                <span>{zone.name}</span>
                <span className="font-semibold">{zone.pct} %</span>
              </div>
              <Bar pct={zone.pct} />
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
