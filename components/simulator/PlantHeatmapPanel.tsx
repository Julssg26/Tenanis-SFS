// components/simulator/PlantHeatmapPanel.tsx
// Trips Simulator — real Tenaris map + waypointed routes following visible roads
'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

// ── Waypointed routes — each segment follows a visible road/corridor ────────
// All coordinates in % of the image (0–100 both axes, image 925×521)
//
// Road corridors identified from the satellite map:
//   H1: Main horizontal corridor y≈49 (W-E through center)
//   H2: Lower horizontal         y≈71-76 (through BM23 area)
//   V1: Left access road         x≈12    (western edge)
//   V2: BM/UT corridor           x≈27-32 (between centros and MOTU)
//   V3: MOTU-APRO divider        x≈50-52 (central vertical)
//   D1: Diagonal                 (12,42)→(38,50) main plant diagonal road

const ROUTE_PATHS: Record<string, number[][]> = {
  // Gate → BM31: enter west access (V1), turn onto H1, north to BM31
  r1:  [[6,50], [12,50], [12,42], [25,37], [33.5,33]],
  // BM31 → UT31: east along building street, then north
  r2:  [[33.5,33], [33.5,39], [41.5,38.5], [41.5,33]],
  // UT31 → G_WIP: south on V2, diagonal D1 corridor, arrive G-WIP
  r3:  [[41.5,33], [41.5,46], [38,50], [38,55.5], [40,55.5]],
  // G_WIP → G_FG: east via MOTU internal road
  r4:  [[40,55.5], [44,54], [47.5,59.5]],
  // G_FG → 4TOP: north on V3 corridor, approach 4TOP from south
  r5:  [[47.5,59.5], [50,57], [52,50], [56,45], [60.5,40]],
  // 4TOP → J: south on V3, east on cross-road to J
  r6:  [[60.5,40], [60.5,52], [64,53], [68.5,54.5]],
  // BM32 → 800: south on V2 to MOTU road, east
  r9:  [[31.5,39.5], [31.5,46], [37,46], [43.5,46]],
  // P → N: east along H2-like corridor into N
  r11: [[43.5,68.5], [50,69], [56,68.5], [59.5,72]],
  // BM23 → LIN4/5: south then east along H2
  r10: [[20.5,72.5], [20.5,76], [27,79], [33.5,82]],
  // PREM31 → 4TOP: east upper road
  r12: [[53.5,27], [57,27], [60,30], [60.5,35]],
  // UT33 → 900: short north connector
  r13: [[44.5,26.5], [44.5,22], [47.5,22.5]],
}

// Route display metadata
const ROUTE_META: Record<string, { color: string; dash?: boolean }> = {
  r1:  { color: '#e91e8c' },
  r2:  { color: '#3f51b5' },
  r3:  { color: '#4caf50' },
  r4:  { color: '#8bc34a' },
  r5:  { color: '#2196f3' },
  r6:  { color: '#1565c0', dash: true },
  r9:  { color: '#43a047' },
  r11: { color: '#00897b' },
  r10: { color: '#9c27b0', dash: true },
  r12: { color: '#ff9800' },
  r13: { color: '#4caf50' },
}

const UNIT_ROUTES = ['r1','r2','r3','r4','r5','r6','r9','r10','r11','r12','r13']
const UNIT_COLORS = ['#e91e8c','#ff9800','#00e5ff','#69f0ae','#ff6d00','#ea80fc','#40c4ff','#ccff90','#ff4081','#18ffff','#b9f6ca']

// ── Polyline interpolation ──────────────────────────────────────────────────
// Walk along a multi-segment polyline at a given normalized progress (0–1)
function interpolatePath(points: number[][], t: number): { x: number; y: number; angle: number } {
  if (points.length < 2) return { x: points[0][0], y: points[0][1], angle: 0 }

  // Compute segment lengths
  const lens: number[] = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i-1][0]
    const dy = points[i][1] - points[i-1][1]
    const l  = Math.sqrt(dx*dx + dy*dy)
    lens.push(l)
    total += l
  }

  // Walk to target distance
  const target = t * total
  let acc = 0
  for (let i = 0; i < lens.length; i++) {
    if (acc + lens[i] >= target || i === lens.length - 1) {
      const segT = lens[i] > 0 ? (target - acc) / lens[i] : 0
      const p0 = points[i], p1 = points[i + 1]
      const x  = p0[0] + (p1[0] - p0[0]) * segT
      const y  = p0[1] + (p1[1] - p0[1]) * segT
      const angle = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180 / Math.PI
      return { x, y, angle }
    }
    acc += lens[i]
  }
  const last = points[points.length - 1]
  return { x: last[0], y: last[1], angle: 0 }
}

// Build SVG polyline points string from waypoints
function polylinePoints(pts: number[][]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(' ')
}

interface Unit { id: string; routeId: string; progress: number; speed: number; color: string; label: string }

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

export default function PlantHeatmapPanel() {
  const [running,   setRunning  ] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [units,     setUnits    ] = useState<Unit[]>([])
  const animRef = useRef<number | null>(null)

  function initUnits(): Unit[] {
    return UNIT_ROUTES.map((routeId, i) => ({
      id: `u${i}`, routeId,
      progress: Math.random(),
      speed:    0.0010 + Math.random() * 0.0018,
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
          <div className="pt-2 border-t border-gray-100 space-y-1.5">
            <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">Route Types</div>
            {[
              { color: '#e91e8c', label: 'Entrance / Gate'      },
              { color: '#4caf50', label: 'MOTU — Pipe flow'     },
              { color: '#2196f3', label: 'APRO — Finished prod.'  },
              { color: '#ff9800', label: 'Centro → Patio'       },
              { color: '#9c27b0', label: 'Líneas proceso'        },
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

          {/* Subtle dark overlay for contrast */}
          <div className="absolute inset-0 bg-black/15" />

          {/* SVG overlay — routes as polylines following road corridors */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Route polylines — each follows road waypoints */}
            {Object.entries(ROUTE_PATHS).map(([id, pts]) => {
              const meta = ROUTE_META[id]
              if (!meta) return null
              return (
                <polyline
                  key={id}
                  points={polylinePoints(pts)}
                  fill="none"
                  stroke={meta.color}
                  strokeWidth="0.4"
                  strokeOpacity="0.9"
                  strokeDasharray={meta.dash ? '1.2 0.8' : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            })}

            {/* Waypoint dots at turn corners — shows road corners */}
            {Object.entries(ROUTE_PATHS).map(([id, pts]) => {
              const meta = ROUTE_META[id]
              if (!meta) return null
              // Only draw intermediate waypoints (not start/end)
              return pts.slice(1, -1).map((pt, i) => (
                <circle
                  key={`${id}-wp${i}`}
                  cx={pt[0]} cy={pt[1]} r="0.4"
                  fill={meta.color} fillOpacity="0.5"
                />
              ))
            })}
          </svg>

          {/* Animated units — follow polyline paths */}
          {units.map(unit => {
            const pts = ROUTE_PATHS[unit.routeId]
            if (!pts) return null
            const { x, y, angle } = interpolatePath(pts, unit.progress)
            return (
              <div
                key={unit.id}
                className="absolute"
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', zIndex: 10 }}
              >
                {/* Glow pulse */}
                <div className="absolute rounded-full animate-ping"
                  style={{ background: unit.color, opacity: 0.25, width: 14, height: 14, top: -3, left: -3 }}/>
                {/* Truck capsule — rotated to face direction of travel */}
                <div
                  className="flex items-center justify-center rounded-sm shadow-lg text-white font-bold"
                  style={{
                    background:    unit.color,
                    width:         26, height: 12,
                    fontSize:      6.5,
                    transform:     `rotate(${angle}deg)`,
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
          <div className="absolute bottom-1.5 left-2 text-[8px] text-white/60 z-20">
            Tenaris Tamsa · Internal Logistics Simulation
          </div>
        </div>
      </div>
    </div>
  )
}
