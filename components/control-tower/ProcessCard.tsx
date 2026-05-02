// components/control-tower/ProcessCard.tsx

function Bar({ pct }: { pct: number }) {
  const color = pct >= 75 ? 'bg-red-500' : pct >= 50 ? 'bg-amber-400' : 'bg-green-500'
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

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
            <div className="flex justify-between text-[11px] text-gray-600 mb-1">
              <span>{item.name}</span>
              <span className="font-semibold">{item.pct}%</span>
            </div>
            <Bar pct={item.pct} />
          </div>
        ))}
      </div>
    </div>
  )
}
