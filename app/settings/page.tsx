import SectionHeader from '@/components/ui/SectionHeader'
import AlgorithmWeights from '@/components/settings/AlgorithmWeights'
import IntegrationStatus from '@/components/settings/IntegrationStatus'
import { Clock, Bell } from 'lucide-react'
import { SHIFT_DEFS, ALERT_THRESHOLDS } from '@/lib/mock-data'

export default function SettingsPage() {
  return (
    <div>
      <SectionHeader
        title="Settings"
        subtitle="System configuration and algorithm parameters"
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Algorithm Weights */}
        <AlgorithmWeights />

        {/* Shift Definitions */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-[#1a237e]" />
            <span className="text-[14px] font-semibold text-gray-800">Shift Definitions</span>
          </div>
          <div className="text-[12px] text-gray-500 mb-4">Operating shift schedule</div>

          <div className="space-y-3">
            {SHIFT_DEFS.map(shift => (
              <div key={shift.name} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-gray-800">{shift.name}</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">{shift.hours}</div>
                </div>
                <div className="text-[12px] text-gray-600">{shift.operators} operators</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={16} className="text-[#1a237e]" />
            <span className="text-[14px] font-semibold text-gray-800">Alert Thresholds</span>
          </div>
          <div className="text-[12px] text-gray-500 mb-4">Trigger conditions for notifications</div>

          <div className="space-y-3">
            {ALERT_THRESHOLDS.map(a => (
              <div key={a.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-[13px] text-gray-700">{a.label}</span>
                <span className="bg-gray-800 text-white text-[12px] font-mono px-3 py-1 rounded-lg">{a.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Status */}
        <IntegrationStatus />
      </div>
    </div>
  )
}
