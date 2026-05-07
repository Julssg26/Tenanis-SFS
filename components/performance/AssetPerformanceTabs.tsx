'use client'

import { useState } from 'react'
import AssetPerformance from './AssetPerformance'
import AssetDetails     from './AssetDetails'

type AssetView = 'monitoring' | 'details'

export default function AssetPerformanceTabs() {
  const [view, setView] = useState<AssetView>('monitoring')

  return (
    <div className="space-y-4">
      {/* Internal sub-tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {([
          { id: 'monitoring' as AssetView, label: 'Monitoring' },
          { id: 'details'    as AssetView, label: 'Details'    },
        ]).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`px-5 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${
              view === id
                ? 'bg-white text-[#1a237e] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sub-view */}
      {view === 'monitoring' && <AssetPerformance />}
      {view === 'details'    && <AssetDetails />}
    </div>
  )
}
