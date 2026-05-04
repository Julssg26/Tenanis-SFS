// lib/fleet/mockFleet.ts
import type { FleetUnit } from './types'

export function getMockFleet(): FleetUnit[] {
  return [
    {
      id: 'FK-01', name: 'Forklift 01', type: 'forklift', status: 'active',
      coordinates: [-96.2470, 19.1820],
      currentZone: 'Loading Bay', operatorName: 'Carlos Méndez',
      utilization: 84, maintenanceRisk: 18, fuelLevel: 72,
      activeRoute: 'Warehouse → MOTU', lastUpdated: new Date().toISOString(),
    },
    {
      id: 'FK-02', name: 'Forklift 02', type: 'forklift', status: 'warning',
      coordinates: [-96.2430, 19.1795],
      currentZone: 'Pipe Yard', operatorName: 'Ramón Torres',
      utilization: 61, maintenanceRisk: 72, fuelLevel: 45,
      activeRoute: null, lastUpdated: new Date().toISOString(),
    },
    {
      id: 'YT-01', name: 'Tractor 01', type: 'yard_tractor', status: 'active',
      coordinates: [-96.2390, 19.1760],
      currentZone: 'Dispatch', operatorName: 'Luis Paredes',
      utilization: 91, maintenanceRisk: 25, fuelLevel: 88,
      activeRoute: 'Maintenance → Green Yard', lastUpdated: new Date().toISOString(),
    },
    {
      id: 'CR-01', name: 'Tractor 02', type: 'crane', status: 'maintenance',
      coordinates: [-96.2350, 19.1810],
      currentZone: 'Inspection', operatorName: '—',
      utilization: 0, maintenanceRisk: 95, fuelLevel: 100,
      activeRoute: null, lastUpdated: new Date().toISOString(),
    },
  ]
}
