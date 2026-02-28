'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { FLEET_STATE } from '@/lib/mock-data'

export default function FleetStateDonut() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full">
      <div className="mb-1 text-[14px] font-semibold text-[#1a237e]">Fleet State Distribution</div>
      <div className="text-[11px] text-gray-500 mb-3">Current status breakdown</div>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={FLEET_STATE}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {FLEET_STATE.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: number) => [`${val}%`, '']}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
          {FLEET_STATE.map(s => (
            <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
              {s.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
