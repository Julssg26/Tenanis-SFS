// lib/fleet/types.ts
// Types mirror future Supabase table schema — replace mock data with API calls later

export type FleetStatus = 'active' | 'idle' | 'maintenance' | 'warning'
export type FleetType   = 'forklift' | 'yard_tractor' | 'crane' | 'shuttle'

export interface FleetUnit {
  id: string
  name: string
  type: FleetType
  status: FleetStatus
  /** [lon, lat] — OpenLayers format */
  coordinates: [number, number]
  currentZone: string
  operatorName: string
  /** 0–100 */
  utilization: number
  /** 0–100  (higher = more risk) */
  maintenanceRisk: number
  /** 0–100 */
  fuelLevel: number
  activeRoute: string | null
  lastUpdated: string   // ISO string — will come from Supabase updated_at
}
