'use client'

import { useState } from 'react'
import { MapPin, Activity, FileText, Car } from 'lucide-react'

// ── Mock data ─────────────────────────────────────────────────────────────
const ASSETS = [
  {
    id: 'fk01', name: 'Forklift 01', type: 'Large Forklift',
    location: 'Loading Bay', status: 'active',
    icon: '/icons/Forklit-Tracking.png', score: 92,
    vehicleInfo: {
      Brand: 'Hyster', Model: '900', Submodel: 'Cummins QSL 9L',
      Year: '2024', 'Asset ID': '45-2558', VIN: 'VN000452558',
      'Device ID': '860858062791041', Color: 'Yellow', 'Vehicle Type': 'Large Forklift',
    },
    technical: {
      Sector: 'APRO', 'Fuel Type': 'Diesel', 'Engine': '9,000 cm³',
      Horsepower: '350 HP', Torque: '1,627 Nm', 'Fuel Tank': '300 L',
      'Mixed Consumption': '35 L/100 km', 'Urban Consumption': '40 L/100 km',
      'Extra-urban': '30 L/100 km',
    },
  },
  {
    id: 'fk02', name: 'Forklift 02', type: 'Large Forklift',
    location: 'Pipe Yard', status: 'warning',
    icon: '/icons/Forklit-Tracking.png', score: 61,
    vehicleInfo: {
      Brand: 'Hyster', Model: '800', Submodel: 'Cummins QSB 6.7',
      Year: '2022', 'Asset ID': '45-2249', VIN: 'VN000452249',
      'Device ID': '860858062792055', Color: 'Yellow', 'Vehicle Type': 'Large Forklift',
    },
    technical: {
      Sector: 'MOTU', 'Fuel Type': 'Diesel', 'Engine': '6,700 cm³',
      Horsepower: '275 HP', Torque: '1,150 Nm', 'Fuel Tank': '250 L',
      'Mixed Consumption': '30 L/100 km', 'Urban Consumption': '36 L/100 km',
      'Extra-urban': '26 L/100 km',
    },
  },
  {
    id: 'yt01', name: 'Tractor 01', type: 'Yard Tractor',
    location: 'Dispatch', status: 'active',
    icon: '/icons/TICO.png', score: 88,
    vehicleInfo: {
      Brand: 'Capacity', Model: 'TJ5000', Submodel: 'Caterpillar C4.4',
      Year: '2023', 'Asset ID': 'YT-0031', VIN: 'VN000YT0031',
      'Device ID': '860858062793022', Color: 'Orange', 'Vehicle Type': 'Yard Tractor',
    },
    technical: {
      Sector: 'APRO', 'Fuel Type': 'Diesel', 'Engine': '4,400 cm³',
      Horsepower: '120 HP', Torque: '597 Nm', 'Fuel Tank': '150 L',
      'Mixed Consumption': '18 L/100 km', 'Urban Consumption': '22 L/100 km',
      'Extra-urban': '15 L/100 km',
    },
  },
  {
    id: 'cr01', name: 'Tractor 02', type: 'Yard Tractor',
    location: 'Inspection', status: 'maintenance',
    icon: '/icons/TICO.png', score: 18,
    vehicleInfo: {
      Brand: 'Capacity', Model: 'TJ7000', Submodel: 'Liebherr D934',
      Year: '2021', 'Asset ID': 'YT-0044', VIN: 'VN000YT0044',
      'Device ID': '860858062794011', Color: 'Red', 'Vehicle Type': 'Yard Tractor',
    },
    technical: {
      Sector: 'MOTU', 'Fuel Type': 'Diesel', 'Engine': '7,000 cm³',
      Horsepower: '210 HP', Torque: '1,100 Nm', 'Fuel Tank': '200 L',
      'Mixed Consumption': '24 L/100 km', 'Urban Consumption': '29 L/100 km',
      'Extra-urban': '20 L/100 km',
    },
  },
]

const STATUS = {
  active:      { label: 'Active',      dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  warning:     { label: 'Warning',     dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  maintenance: { label: 'Maintenance', dot: 'bg-red-500',   text: 'text-red-700',   bg: 'bg-red-50   border-red-200'   },
}

function scoreColor(s: number) {
  if (s >= 75) return 'bg-green-500'
  if (s >= 40) return 'bg-amber-400'
  return 'bg-red-500'
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-4">
      <span className="text-[12px] text-gray-500 flex-shrink-0">{label}:</span>
      <span className="text-[12px] text-gray-800 font-medium text-right">{value}</span>
    </div>
  )
}

export default function AssetDetails() {
  const [selectedId, setSelectedId] = useState(ASSETS[0].id)
  const asset = ASSETS.find(a => a.id === selectedId) ?? ASSETS[0]
  const sc = STATUS[asset.status as keyof typeof STATUS]

  return (
    <div className="flex gap-4 min-h-[600px]">

      {/* ── LEFT: vehicle list ────────────────────────────────────────── */}
      <div className="w-[200px] flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
            Vehicles ({ASSETS.length})
          </div>
        </div>

        {/* Group label */}
        <div className="px-4 py-1.5 bg-[#1a237e]/8">
          <span className="text-[9px] font-bold text-[#1a237e] uppercase tracking-widest">APRO / MOTU</span>
        </div>

        <div className="divide-y divide-gray-50">
          {ASSETS.map(a => {
            const s   = STATUS[a.status as keyof typeof STATUS]
            const sel = a.id === selectedId
            return (
              <button key={a.id} onClick={() => setSelectedId(a.id)}
                className={`w-full text-left px-3 py-3 transition-colors ${sel ? 'bg-[#e8eaf6] asset-details-selected' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.icon} alt={a.type} width={20} height={20}
                    style={{ objectFit:'contain', filter: sel ? 'none' : 'brightness(0) opacity(0.5)' }}/>
                  <span className={`text-[12px] font-semibold truncate ${sel ? 'text-[#1a237e]' : 'text-gray-800'}`}>
                    {a.name}
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 truncate pl-7">{a.vehicleInfo['Asset ID']} · {a.vehicleInfo.Submodel}</div>
                <div className="flex items-center gap-1 pl-7 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>
                  <span className={`text-[10px] font-medium ${s.text}`}>{s.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── RIGHT: asset detail ───────────────────────────────────────── */}
      <div className="flex-1 space-y-4 min-w-0">

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[#1a237e]">{asset.type} · {asset.vehicleInfo['Asset ID']}</h2>
            <div className="flex items-center gap-3 mt-0.5 text-[12px] text-gray-500">
              <span className="font-medium text-gray-700">{asset.name}</span>
              <span>·</span>
              <MapPin size={11}/><span>{asset.location}</span>
              <span>·</span>
              <span>{asset.vehicleInfo.Brand} {asset.vehicleInfo.Model}</span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${sc.bg} ${sc.text}`}>
            <div className={`w-2 h-2 rounded-full ${sc.dot}`}/>
            {sc.label}
          </div>
        </div>

        {/* Main content: icon card + scoring */}
        <div className="grid grid-cols-[1fr_280px] gap-4">

          {/* Icon / visual card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center" style={{ minHeight: 240 }}>
            <div className="flex flex-col items-center gap-4 p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.icon} alt={asset.name} width={120} height={120}
                style={{ objectFit:'contain', filter:'brightness(0) saturate(100%) invert(14%) sepia(70%) saturate(2000%) hue-rotate(220deg) brightness(80%)' }}/>
              <div className="text-center">
                <div className="text-[16px] font-bold text-[#1a237e]">{asset.name}</div>
                <div className="text-[12px] text-gray-400 mt-0.5">{asset.type} · {asset.vehicleInfo.Submodel}</div>
              </div>
              <div className="flex gap-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><Car size={11}/>{asset.vehicleInfo.Year}</span>
                <span className="flex items-center gap-1"><Activity size={11}/>{asset.vehicleInfo['Fuel Type' in asset.technical ? 'Asset ID' : 'Asset ID']}</span>
                <span className="flex items-center gap-1"><MapPin size={11}/>{asset.location}</span>
              </div>
            </div>
          </div>

          {/* Scoring */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={15} className="text-[#1a237e]"/>
              <span className="text-[13px] font-semibold text-gray-800">Operational Score</span>
            </div>

            <div className="text-[42px] font-black leading-none text-center py-2"
              style={{ color: asset.score >= 75 ? '#16a34a' : asset.score >= 40 ? '#d97706' : '#dc2626' }}>
              {asset.score}
            </div>

            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${scoreColor(asset.score)}`}
                style={{ width: `${asset.score}%` }}/>
            </div>

            <div className="text-[10px] text-gray-400 text-center">
              {asset.score >= 75 ? 'Excellent condition' : asset.score >= 40 ? 'Moderate — monitor closely' : 'Service required immediately'}
            </div>

            <button className="mt-auto w-full text-center border border-[#1a237e] text-[#1a237e] text-[11px] font-semibold py-1.5 rounded-lg hover:bg-[#e8eaf6] transition-colors">
              View Detail
            </button>

            {/* Quick stats */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {[
                { label: 'Fuel Level',    value: `${asset.id === 'fk01' ? 72 : asset.id === 'fk02' ? 45 : asset.id === 'yt01' ? 88 : 100}%` },
                { label: 'Maint. Risk',   value: `${asset.id === 'fk01' ? 18 : asset.id === 'fk02' ? 72 : asset.id === 'yt01' ? 25 : 95}%` },
                { label: 'Device ID',     value: asset.vehicleInfo['Device ID'].slice(-8) },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-[10px]">
                  <span className="text-gray-400">{r.label}</span>
                  <span className="font-semibold text-gray-700">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle Info + Technical Sheet */}
        <div className="grid grid-cols-2 gap-4">

          {/* Vehicle Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Car size={14} className="text-[#1a237e]"/>
              <span className="text-[13px] font-semibold text-gray-800">Vehicle Information</span>
            </div>
            <div>
              {Object.entries(asset.vehicleInfo).map(([k, v]) => (
                <InfoRow key={k} label={k} value={v}/>
              ))}
            </div>
          </div>

          {/* Technical Sheet */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={14} className="text-[#1a237e]"/>
              <span className="text-[13px] font-semibold text-gray-800">Technical Sheet</span>
            </div>
            <div>
              {Object.entries(asset.technical).map(([k, v]) => (
                <InfoRow key={k} label={k} value={v}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
