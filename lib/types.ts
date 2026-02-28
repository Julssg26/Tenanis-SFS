// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  label: string
  href: string
  icon: string
}

// ─── KPI ──────────────────────────────────────────────────────────────────────
export interface KpiData {
  value: string
  label: string
  subLabel: string
  delta: string
  deltaType: 'up' | 'down' | 'stable'
  iconBg: string
  icon: string
}

// ─── Yard ─────────────────────────────────────────────────────────────────────
export interface YardZone {
  name: string
  pct: number
}

// ─── Fleet ────────────────────────────────────────────────────────────────────
export type RiskLevel = 'Low' | 'Medium' | 'High'
export type IdlePattern = 'Low' | 'Medium' | 'High'

export interface FleetUnit {
  id: string
  engineHours: number
  idleAccum: number
  balanceScore: number
  wearIndex: number
  riskLevel: RiskLevel
  nextService: string
}

// ─── Operator ─────────────────────────────────────────────────────────────────
export interface Operator {
  name: string
  opId: string
  unit: string
  shift: string
  compliance: number
  score: number
  incidents: number
  idlePattern: IdlePattern
  training: boolean
}

// ─── Performance ──────────────────────────────────────────────────────────────
export interface EquipmentPerf {
  id: string
  onHours: number
  effective: number
  idle: number
  cycles: number
  efficiency: number
}

// ─── Trip ─────────────────────────────────────────────────────────────────────
export interface ActiveTrip {
  from: string
  to: string
  unitId: string
  etaMin: number
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export interface AlgorithmWeight {
  label: string
  value: number
  key: string
}

export interface IntegrationItem {
  name: string
  status: 'Connected' | 'Partial' | 'Disconnected'
}

export interface ShiftDef {
  name: string
  hours: string
  operators: number
}

export interface AlertThreshold {
  label: string
  value: string
}
