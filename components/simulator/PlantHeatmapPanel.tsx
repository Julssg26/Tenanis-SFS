// components/simulator/PlantHeatmapPanel.tsx
// Trips Simulator — real Tenaris map as background + animated overlay
'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

// ── Zone anchor points (% of image 925×521) ────────────────────────────────
// These coordinates were read directly from the real Tenaris map image.
// x%, y% = center of each labeled zone
const ANCHORS: Record<string, { x: number; y: number }> = {
  // Centros (blue labels, upper-left area)
  BM31:   { x: 33.5, y: 33.0 },
  BM32:   { x: 31.5, y: 39.5 },
  UT31:   { x: 41.5, y: 33.0 },
  UT32:   { x: 41.5, y: 38.5 },
  UT33:   { x: 44.5, y: 26.5 },
  PREM31: { x: 53.5, y: 27.0 },
  // MOTU (green patios, center)
  Z900:   { x: 47.5, y: 22.5 },
  Z800:   { x: 43.5, y: 46.0 },
  G_WIP:  { x: 40.0, y: 55.5 },
  G_FG:   { x: 47.5, y: 59.5 },
  P:      { x: 43.5, y: 68.5 },
  // APRO (blue patios, right side)
  '4TOP': { x: 60.5, y: 34.5 },
  L:      { x: 64.5, y: 33.5 },
  B:      { x: 59.5, y: 56.5 },
  J:      { x: 68.5, y: 54.5 },
  N:      { x: 59.5, y: 72.0 },
  Q:      { x: 69.5, y: 75.0 },
  W:      { x: 87.0, y: 47.0 },
  // Inferior-left
  BM23:   { x: 20.5, y: 72.5 },
  BM22:   { x: 21.5, y: 80.5 },
  BM21:   { x: 19.5, y: 88.5 },
  LIN45:  { x: 33.5, y: 82.0 },
  Isla:   { x: 14.5, y: 82.5 },
  S:      { x: 16.5, y: 65.5 },
  GATE:   { x:  6.0, y: 50.0 },
}

// ── Routes ─────────────────────────────────────────────────────────────────
const ROUTES = [
  { id: 'r1',  from: 'GATE',   to: 'BM31',  color: '#e91e8c',  dash: false },
  { id: 'r2',  from: 'BM31',   to: 'UT31',  color: '#3f51b5',  dash: false },
  { id: 'r3',  from: 'UT31',   to: 'G_WIP', color: '#4caf50',  dash: false },
  { id: 'r4',  from: 'G_WIP',  to: 'G_FG',  color: '#8bc34a',  dash: false },
  { id: 'r5',  from: 'G_FG',   to: '4TOP',  color: '#2196f3',  dash: false },
  { id: 'r6',  from: '4TOP',   to: 'J',     color: '#1565c0',  dash: true  },
  { id: 'r7',  from: 'J',      to: 'Q',     color: '#1976d2',  dash: true  },
  { id: 'r8',  from: 'B',      to: 'N',     color: '#0288d1',  dash: true  },
  { id: 'r9',  from: 'BM32',   to: 'Z800',  color: '#43a047',  dash: false },
  { id: 'r10', from: 'BM23',   to: 'LIN45', color: '#9c27b0',  dash: true  },
  { id: 'r11', from: 'P',      to: 'N',     color: '#00897b',  dash: false },
  { id: 'r12', from: 'PREM31', to: '4TOP',  color: '#ff9800',  dash: false },
  { id: 'r13', from: 'UT33',   to: 'Z900',  color: '#4caf50',  dash: false },
  { id: 'r14', from: 'BM22',   to: 'BM23',  color: '#3f51b5',  dash: false },
]

const UNIT_ROUTES  = ['r1','r2','r3','r4','r5','r6','r9','r10','r11','r12','r13']
const UNIT_COLORS  = ['#e91e8c','#ff9800','#00e5ff','#69f0ae','#ff6d00','#ea80fc','#40c4ff','#ccff90','#ff4081','#18ffff','#b9f6ca']

interface Unit {
  id: string; routeId: string; progress: number; speed: number
  color: string; label: string
}

const STATS = [
  { label: 'Active Trips',    value: '18',     sub: '12 in · 6 out',     color: '#1a237e' },
  { label: 'Avg Cycle Time',  value: '23 min', sub: 'Per internal trip',  color: '#2e7d32' },
  { label: 'Zone Utilization',value: '67%',    sub: '33% capacity free',  color: '#1565c0' },
  { label: 'Pending Tasks',   value: '7',      sub: 'Transfer · Storage', color: '#c62828' },
]

const SCENARIOS = [
  'Reduce fleet by 1 tractor',
  'Optimize routing algorithm',
  'Redistribute zone assignments',
  'Adjust shift overlaps (+30 min)',
]

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

export default function PlantHeatmapPanel() {
  const [running,   setRunning  ] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [units,     setUnits    ] = useState<Unit[]>([])
  const animRef = useRef<number | null>(null)

  function initUnits(): Unit[] {
    return UNIT_ROUTES.map((routeId, i) => ({
      id: `u${i}`, routeId,
      progress: Math.random(),
      speed:    0.0012 + Math.random() * 0.002,
      color:    UNIT_COLORS[i % UNIT_COLORS.length],
      label:    `T-${31 + i}`,
    }))
  }

  function runSim() {
    setRunning(true); setCompleted(false); setUnits(initUnits())
    setTimeout(() => { setRunning(false); setCompleted(true) }, 15000)
  }
  function reset() {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setRunning(false); setCompleted(false); setUnits([])
  }

  useEffect(() => {
    if (!running) return
    const tick = () => {
      setUnits(prev => prev.map(u => ({ ...u, progress: (u.progress + u.speed) % 1 })))
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [running])

  return (
    <div className="p-4 space-y-3">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
            <div className="text-[11px] text-gray-500 mb-0.5">{s.label}</div>
            <div className="text-[20px] font-black leading-none" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[9px] text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main area */}
      <div className="flex gap-3">
        {/* Scenario panel */}
        <div className="w-[210px] flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2.5">
          <div className="text-[13px] font-semibold text-gray-800">Scenario Configuration</div>
          {SCENARIOS.map(s => (
            <div key={s} className="text-[11px] text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50">{s}</div>
          ))}
          <button onClick={running ? reset : runSim}
            className={`w-full flex items-center justify-center gap-2 text-white text-[12px] font-semibold rounded-xl py-2 transition-colors ${
              running ? 'bg-gray-500 hover:bg-gray-600' : 'bg-[#1a237e] hover:bg-[#283593]'
            }`}>
            {running ? <><Pause size={13}/> Stop</> : <><Play size={13}/> Run Simulation</>}
          </button>
          {completed && (
            <button onClick={reset}
              className="w-full flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-600 text-[11px] py-1">
              <RotateCcw size={11}/> Reset
            </button>
          )}
          {/* Legend */}
          <div className="pt-2 border-t border-gray-100 space-y-1.5">
            <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Route Types</div>
            {[
              { color: '#e91e8c', label: 'Entrance / Gate' },
              { color: '#4caf50', label: 'MOTU — Pipe flow' },
              { color: '#2196f3', label: 'APRO — Finished product' },
              { color: '#ff9800', label: 'Centro → Patio' },
              { color: '#9c27b0', label: 'Líneas proceso' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-1.5 rounded-sm flex-shrink-0" style={{ background: l.color }}/>
                <span className="text-[9px] text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
          {completed && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-2.5 py-2">
              <div className="text-[11px] font-semibold text-green-700">✓ Simulation complete</div>
              <div className="text-[9px] text-green-600 mt-0.5">18 trips processed</div>
            </div>
          )}
        </div>

        {/* Map canvas */}
        <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative"
          style={{ aspectRatio: '925/521', minHeight: 280 }}>

          {/* Real Tenaris map as background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/simulator/tenaris-map.jpg"
            alt="Tenaris Tamsa Map"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay to improve contrast of animated elements */}
          <div className="absolute inset-0 bg-black/20" />

          {/* SVG overlay — routes and units use % coordinates */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100"
            preserveAspectRatio="none">

            {/* Route lines */}
            {ROUTES.map(route => {
              const from = ANCHORS[route.from]
              const to   = ANCHORS[route.to]
              if (!from || !to) return null
              return (
                <line key={route.id}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={route.color}
                  strokeWidth="0.35"
                  strokeOpacity="0.85"
                  strokeDasharray={route.dash ? '1.2 0.8' : undefined}
                  strokeLinecap="round"
                />
              )
            })}
          </svg>

          {/* Units — positioned absolutely using % */}
          {units.map(unit => {
            const route = ROUTES.find(r => r.id === unit.routeId)
            if (!route) return null
            const from = ANCHORS[route.from]
            const to   = ANCHORS[route.to]
            if (!from || !to) return null
            const x = lerp(from.x, to.x, unit.progress)
            const y = lerp(from.y, to.y, unit.progress)
            const dx = to.x - from.x
            const dy = to.y - from.y
            const angle = Math.atan2(dy, dx) * 180 / Math.PI

            return (
              <div
                key={unit.id}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top:  `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full opacity-30 animate-ping"
                  style={{ background: unit.color, width: 14, height: 14, top: -3, left: -3 }} />
                {/* Truck body */}
                <div
                  className="relative flex items-center justify-center rounded-sm shadow-lg text-white font-bold"
                  style={{
                    background:   unit.color,
                    width:        26,
                    height:       13,
                    fontSize:     7,
                    transform:    `rotate(${angle}deg)`,
                    letterSpacing: '0.3px',
                  }}
                >
                  {unit.label}
                </div>
              </div>
            )
          })}

          {/* Status badges */}
          {running && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg z-20">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"/>
              Simulation Active
            </div>
          )}
          {!running && !completed && (
            <div className="absolute top-2 right-2 text-[10px] text-gray-200 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full z-20">
              Press Run to start
            </div>
          )}
          {completed && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-[#1a237e] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg z-20">
              ✓ Simulation complete
            </div>
          )}

          {/* Map caption */}
          <div className="absolute bottom-1.5 left-2 text-[8px] text-white/60 z-20">
            Tenaris Tamsa · Internal Logistics Simulation
          </div>
        </div>
      </div>
    </div>
  )
}

