import ProgressBar from '@/components/ui/ProgressBar'
import { YARD_ZONES } from '@/lib/mock-data'

export default function YardCongestion() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full">
      <div className="mb-1 text-[14px] font-semibold text-[#1a237e]">Yard Congestion Index</div>
      <div className="text-[11px] text-gray-500 mb-4">Real-time zone saturation levels</div>

      <div className="grid grid-cols-3 gap-3">
        {YARD_ZONES.map(zone => (
          <div key={zone.name} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-medium text-gray-700">{zone.name}</span>
              <span className="text-[12px] font-bold text-gray-700">{zone.pct}%</span>
            </div>
            <ProgressBar value={zone.pct} showLabel={false} />
          </div>
        ))}
      </div>
    </div>
  )
}
