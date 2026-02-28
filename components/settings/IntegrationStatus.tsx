import { Wifi } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { INTEGRATIONS } from '@/lib/mock-data'

export default function IntegrationStatus() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-1">
        <Wifi size={16} className="text-[#1a237e]" />
        <span className="text-[14px] font-semibold text-gray-800">Integration Status</span>
      </div>
      <div className="text-[12px] text-gray-500 mb-4">Data source connections</div>

      <div className="space-y-3">
        {INTEGRATIONS.map(item => (
          <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-[13px] text-gray-700">{item.name}</span>
            <StatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
