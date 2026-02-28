'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { EQUIPMENT_PERF } from '@/lib/mock-data'

export default function EquipmentRanking() {
  const chartData = EQUIPMENT_PERF.map(e => ({
    id: e.id,
    efficiency: e.efficiency,
  })).sort((a, b) => b.efficiency - a.efficiency)

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-5">
      <div className="text-[14px] font-semibold text-gray-800 mb-4">Equipment Ranking by Efficiency</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 55, bottom: 0 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="id"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(val: number) => [`${val}%`, 'Efficiency']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="efficiency" fill="#16a34a" radius={[0, 3, 3, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
