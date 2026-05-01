// lib/alerts/mockAlerts.ts
// Replace getMockAlerts() with Supabase query later:
//   const { data } = await supabase.from('alerts').select('*').eq('status','active')

import type { Alert } from './types'

export function getMockAlerts(): Alert[] {
  return [
    {
      id: 'AL-001', unitId: 'CR-01', unitName: 'Crane 01',
      title: 'Maintenance Required',
      description: 'Maintenance risk at 95%. Unit must be serviced immediately.',
      severity: 'critical', status: 'active',
      zone: 'Inspection', createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'AL-002', unitId: 'FK-02', unitName: 'Forklift 02',
      title: 'High Maintenance Risk',
      description: 'Maintenance risk at 72%. Schedule preventive service.',
      severity: 'warning', status: 'active',
      zone: 'Pipe Yard', createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'AL-003', unitId: 'SH-01', unitName: 'Shuttle 01',
      title: 'Low Utilization',
      description: 'Unit utilization at 22%. Consider redeployment.',
      severity: 'info', status: 'active',
      zone: 'Blue Yard', createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'AL-004', unitId: 'FK-02', unitName: 'Forklift 02',
      title: 'Operator Required',
      description: 'Unit is in Warning state without active route assigned.',
      severity: 'warning', status: 'active',
      zone: 'Pipe Yard', createdAt: new Date(Date.now() - 900000).toISOString(),
    },
    {
      id: 'AL-005', unitId: 'YT-01', unitName: 'Yard Tractor 01',
      title: 'Congestion Risk',
      description: 'Route Maintenance → Green Yard showing congestion indicators.',
      severity: 'info', status: 'acknowledged',
      zone: 'Dispatch', createdAt: new Date(Date.now() - 5400000).toISOString(),
    },
  ]
}
