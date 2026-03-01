import ProgressBar from '@/components/ui/ProgressBar'

const PROCESS_ITEMS = [
  { name: 'Dispatch',   pct: 73 },
  { name: 'Inspection', pct: 35 },
]

export default function ProcessCard() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-[13px] font-semibold text-gray-800 mb-3">Process</div>
      <div className="space-y-3">
        {PROCESS_ITEMS.map(item => (
          <div key={item.name}>
            <div className="flex justify-between text-[12px] text-gray-600 mb-1">
              <span>{item.name}</span>
              <span className="font-semibold">{item.pct} %</span>
            </div>
            <ProgressBar value={item.pct} showLabel={false} size="md" />
          </div>
        ))}
      </div>
    </div>
  )
}
