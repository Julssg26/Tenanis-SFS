'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import SectionHeader from '@/components/ui/SectionHeader'
import KpiCard from '@/components/ui/KpiCard'
import FleetStateDonut from '@/components/dashboard/FleetStateDonut'
import YardCongestion from '@/components/dashboard/YardCongestion'
import { DASHBOARD_KPIS, ON_VS_EFFECTIVE, UTILIZATION_SHIFT } from '@/lib/mock-data'

export default function DashboardPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Guard: sin isAuth → volver al login
    if (localStorage.getItem('isAuth') !== '1') {
      router.replace('/')
      return
    }
    setReady(true)
    // Sin timeout de expiración
  }, [router])

  // Esperar confirmación de auth antes de renderizar
  if (!ready) return null

  return (
    <div>
      <SectionHeader
        title="Executive Overview"
        subtitle="Real time fleet performance - Feb 28, 2026 - Shift 1"
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {DASHBOARD_KPIS.map((kpi, i) => (
          <KpiCard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-[14px] font-semibold text-[#1a237e] mb-0.5">ON vs Effective Hours</div>
          <div className="text-[11px] text-gray-500 mb-4">Hourly distribution day</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ON_VS_EFFECTIVE} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradOn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1a237e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1a237e" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gradEff" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6b7280" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time"  tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis                 tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="on"        stroke="#1a237e" strokeWidth={2}   fill="url(#gradOn)"  name="ON Hours" />
              <Area type="monotone" dataKey="effective" stroke="#9ca3af" strokeWidth={1.5} fill="url(#gradEff)" name="Effective" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-[14px] font-semibold text-[#1a237e] mb-0.5">Utilization by Shift</div>
          <div className="text-[11px] text-gray-500 mb-4">Active vs idle breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={UTILIZATION_SHIFT} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="shift" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis                 tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="active" fill="#16a34a" name="Active" radius={[3,3,0,0]} barSize={28} />
              <Bar dataKey="idle"   fill="#e91e8c" name="Idle"   radius={[3,3,0,0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-2 gap-4">
        <FleetStateDonut />
        <YardCongestion />
      </div>
    </div>
  )
}
