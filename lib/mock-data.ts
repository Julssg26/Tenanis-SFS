import type {
  KpiData, YardZone, FleetUnit, Operator,
  EquipmentPerf, ActiveTrip, AlgorithmWeight,
  IntegrationItem, ShiftDef, AlertThreshold
} from './types'

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────
export const DASHBOARD_KPIS: KpiData[] = [
  { value: '1,247 h', label: 'Total ON Hours',        subLabel: 'Current period',    delta: '-12%',   deltaType: 'down',   iconBg: 'bg-pink-500',   icon: 'Clock' },
  { value: '986 h',   label: 'Effective Working Hours',subLabel: '79 % of total',     delta: '+5%',    deltaType: 'up',     iconBg: 'bg-green-600',  icon: 'Zap' },
  { value: '18.3 %',  label: 'Idle Time',             subLabel: 'Target: <15 %',     delta: '-3.2%',  deltaType: 'down',   iconBg: 'bg-pink-500',   icon: 'PauseCircle' },
  { value: '1,247 h', label: 'Total ON Hours',        subLabel: 'Current period',    delta: '+2.1%',  deltaType: 'up',     iconBg: 'bg-green-600',  icon: 'Timer' },
  { value: '0.62',    label: 'Congestion Index',      subLabel: 'Moderate',          delta: '-0.08',  deltaType: 'down',   iconBg: 'bg-pink-500',   icon: 'AlertTriangle' },
  { value: '2 Units', label: 'Maintenance Risk',      subLabel: 'Upcoming service',  delta: 'Stable', deltaType: 'stable', iconBg: 'bg-indigo-500', icon: 'Wrench' },
  { value: '4,821 L', label: 'Energy Estimate',       subLabel: 'Diesel consumed',   delta: '-8%',    deltaType: 'down',   iconBg: 'bg-pink-500',   icon: 'Fuel' },
  { value: '17.2 %',  label: 'Hours Reduction',       subLabel: 'Target: 20%',       delta: '+2.5%',  deltaType: 'up',     iconBg: 'bg-green-600',  icon: 'TrendingDown' },
]

// ─── ON vs Effective Hours chart data ─────────────────────────────────────────
export const ON_VS_EFFECTIVE = [
  { time: '06:00', on: 38, effective: 30 },
  { time: '08:00', on: 44, effective: 35 },
  { time: '10:00', on: 50, effective: 42 },
  { time: '12:00', on: 48, effective: 40 },
  { time: '14:00', on: 52, effective: 44 },
  { time: '16:00', on: 46, effective: 38 },
  { time: '18:00', on: 42, effective: 34 },
  { time: '20:00', on: 36, effective: 28 },
  { time: '22:00', on: 30, effective: 22 },
]

// ─── Utilization by shift ─────────────────────────────────────────────────────
export const UTILIZATION_SHIFT = [
  { shift: 'Shift 1', active: 78, idle: 18 },
  { shift: 'Shift 2', active: 72, idle: 22 },
  { shift: 'Shift 3', active: 65, idle: 35 },
]

// ─── Fleet state distribution (donut) ─────────────────────────────────────────
export const FLEET_STATE = [
  { name: 'Active',         value: 45, color: '#16a34a' },
  { name: 'Loading',        value: 25, color: '#eab308' },
  { name: 'Idle',           value: 15, color: '#f97316' },
  { name: 'Maintenance',    value: 10, color: '#6366f1' },
  { name: 'Critical Idle',  value: 5,  color: '#ef4444' },
]

// ─── Yard zones ───────────────────────────────────────────────────────────────
export const YARD_ZONES: YardZone[] = [
  { name: 'Blue Yard',  pct: 85 },
  { name: 'Green Yard', pct: 62 },
  { name: 'MOTU',       pct: 45 },
  { name: 'Dispatch',   pct: 73 },
  { name: 'Inspection', pct: 38 },
  { name: 'Storage A',  pct: 56 },
]

// ─── Active trips ─────────────────────────────────────────────────────────────
export const ACTIVE_TRIPS: ActiveTrip[] = [
  { from: 'Blue Yard',   to: 'MOTU',       unitId: '50-2355', etaMin: 4 },
  { from: 'Storage A',   to: 'Dispatch',   unitId: '50-2359', etaMin: 7 },
  { from: 'Inspection',  to: 'Green Yard', unitId: '50-2352', etaMin: 3 },
]

// ─── Yard capacity (control tower sidebar) ────────────────────────────────────
export const YARD_CAPACITY: YardZone[] = [
  { name: 'Blue Yard',  pct: 82 },
  { name: 'Green Yard', pct: 45 },
  { name: 'MOTU',       pct: 60 },
  { name: 'Dispatch',   pct: 73 },
  { name: 'Inspection', pct: 35 },
]

// ─── Equipment performance ────────────────────────────────────────────────────
export const EQUIPMENT_PERF: EquipmentPerf[] = [
  { id: '50-2355', onHours: 142, effective: 118, idle: 16.9, cycles: 24, efficiency: 83 },
  { id: '50-2361', onHours: 138, effective: 105, idle: 23.9, cycles: 21, efficiency: 76 },
  { id: '50-2348', onHours: 135, effective: 112, idle: 17.0, cycles: 23, efficiency: 83 },
  { id: '50-2370', onHours: 150, effective: 108, idle: 28.0, cycles: 19, efficiency: 72 },
  { id: '50-2359', onHours: 128, effective: 110, idle: 14.1, cycles: 25, efficiency: 86 },
  { id: '50-2364', onHours: 95,  effective: 70,  idle: 26.3, cycles: 14, efficiency: 74 },
]

// ─── Fleet health ─────────────────────────────────────────────────────────────
export const FLEET_UNITS: FleetUnit[] = [
  { id: '50-2355', engineHours: 4280, idleAccum: 680,  balanceScore: 82, wearIndex: 34, riskLevel: 'Low',    nextService: 'Mar 5'  },
  { id: '50-2361', engineHours: 5120, idleAccum: 1240, balanceScore: 65, wearIndex: 58, riskLevel: 'Medium', nextService: 'Feb 28' },
  { id: '50-2348', engineHours: 3890, idleAccum: 550,  balanceScore: 88, wearIndex: 28, riskLevel: 'Low',    nextService: 'Mar 12' },
  { id: '50-2370', engineHours: 6200, idleAccum: 1980, balanceScore: 52, wearIndex: 72, riskLevel: 'High',   nextService: 'Feb 24' },
  { id: '50-2359', engineHours: 3150, idleAccum: 420,  balanceScore: 91, wearIndex: 21, riskLevel: 'Low',    nextService: 'Mar 18' },
  { id: '50-2364', engineHours: 5800, idleAccum: 1650, balanceScore: 58, wearIndex: 65, riskLevel: 'High',   nextService: 'Feb 25' },
  { id: '50-2352', engineHours: 4100, idleAccum: 720,  balanceScore: 78, wearIndex: 38, riskLevel: 'Medium', nextService: 'Mar 8'  },
  { id: '50-2377', engineHours: 2800, idleAccum: 340,  balanceScore: 93, wearIndex: 18, riskLevel: 'Low',    nextService: 'Mar 22' },
]

// ─── Operators / Drivers ──────────────────────────────────────────────────────
export const OPERATORS: Operator[] = [
  { name: 'J. García',  opId: 'OP-001', unit: '50-2355', shift: 'Shift 1', compliance: 94, score: 92, incidents: 0, idlePattern: 'Low',    training: false },
  { name: 'R. López',   opId: 'OP-002', unit: '50-2361', shift: 'Shift 1', compliance: 87, score: 84, incidents: 1, idlePattern: 'Medium', training: true  },
  { name: 'M. Torres',  opId: 'OP-003', unit: '50-2348', shift: 'Shift 2', compliance: 91, score: 89, incidents: 0, idlePattern: 'Low',    training: false },
  { name: 'A. Ruiz',    opId: 'OP-004', unit: '50-2370', shift: 'Shift 2', compliance: 78, score: 74, incidents: 2, idlePattern: 'High',   training: true  },
  { name: 'C. Herrera', opId: 'OP-005', unit: '50-2359', shift: 'Shift 1', compliance: 96, score: 95, incidents: 0, idlePattern: 'Low',    training: false },
  { name: 'L. Méndez',  opId: 'OP-006', unit: '50-2352', shift: 'Shift 3', compliance: 89, score: 86, incidents: 0, idlePattern: 'Low',    training: false },
  { name: 'P. Sánchez', opId: 'OP-007', unit: '50-2377', shift: 'Shift 3', compliance: 85, score: 62, incidents: 1, idlePattern: 'Medium', training: true  },
]

// ─── Settings ─────────────────────────────────────────────────────────────────
export const ALGORITHM_WEIGHTS: AlgorithmWeight[] = [
  { label: 'Proximity',    value: 35, key: 'proximity'   },
  { label: 'Wear Balance', value: 25, key: 'wear'        },
  { label: 'Congestion',   value: 20, key: 'congestion'  },
  { label: 'Maintenance',  value: 20, key: 'maintenance' },
]

export const INTEGRATIONS: IntegrationItem[] = [
  { name: 'GPS Tracking',        status: 'Connected'    },
  { name: 'RFID Trailer System', status: 'Connected'    },
  { name: 'Tablet Task Manager', status: 'Connected'    },
  { name: 'Engine Telemetry',    status: 'Partial'      },
  { name: 'Weather Service',     status: 'Disconnected' },
]

export const SHIFT_DEFS: ShiftDef[] = [
  { name: 'Shift 1', hours: '06:00 - 14:00', operators: 5 },
  { name: 'Shift 2', hours: '14:00 - 22:00', operators: 4 },
  { name: 'Shift 3', hours: '22:00 - 06:00', operators: 3 },
]

export const ALERT_THRESHOLDS: AlertThreshold[] = [
  { label: 'Idle Time Warning',  value: '15 min'      },
  { label: 'Idle Time Critical', value: '30 min'      },
  { label: 'Congestion Alert',   value: '> 80 %'      },
  { label: 'Maintenance Risk',   value: 'Wear > 0.6'  },
  { label: 'Overutilization',    value: '> 140/week'  },
]
