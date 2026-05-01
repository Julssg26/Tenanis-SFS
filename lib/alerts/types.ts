// lib/alerts/types.ts

export type AlertSeverity = 'critical' | 'warning' | 'info'
export type AlertStatus   = 'active' | 'acknowledged' | 'resolved'

export interface Alert {
  id: string
  unitId: string
  unitName: string
  title: string
  description: string
  severity: AlertSeverity
  status: AlertStatus
  zone: string
  createdAt: string   // ISO — will map to Supabase created_at
}
