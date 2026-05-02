import { INTEGRATIONS } from '@/lib/mock-data'

const STATUS_COLOR: Record<string, string> = {
  Connected:    'text-green-700 bg-green-50  border-green-200',
  Partial:      'text-amber-700 bg-amber-50  border-amber-200',
  Disconnected: 'text-red-600   bg-red-50    border-red-200',
}

export default function IntegrationStatus() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="text-[14px] font-semibold text-gray-800 mb-1">
        Integration Status
      </div>
      <div className="text-[12px] text-gray-500 mb-4">
        Connected external systems
      </div>
      <div className="space-y-0">
        {INTEGRATIONS.map(item => (
          <div key={item.name}
            className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <span className="text-[13px] text-gray-700">{item.name}</span>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_COLOR[item.status] ?? STATUS_COLOR.Disconnected}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
