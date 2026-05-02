// app/api/ai/route.ts — Simulated local assistant, no external APIs required
import { NextRequest, NextResponse } from 'next/server'
import { getMockFleet } from '@/lib/fleet/mockFleet'
import { getMockAlerts } from '@/lib/alerts/mockAlerts'

interface HistoryEntry { role: string; content: string }
interface RequestBody  { message: string; history?: HistoryEntry[] }

// ── Simulated response engine using real mock data ─────────────────────────────
function generateReply(message: string): string {
  const fleet  = getMockFleet()
  const alerts = getMockAlerts().filter(a => a.status === 'active')
  const msg    = message.toLowerCase()

  // Active alerts
  if (/alert|warning|critical|notification|issue/i.test(msg)) {
    const crit = alerts.filter(a => a.severity === 'critical')
    const warn = alerts.filter(a => a.severity === 'warning')
    const info = alerts.filter(a => a.severity === 'info')
    const lines = alerts.map(a => `• [${a.severity.toUpperCase()}] ${a.title} — ${a.unitName}, ${a.zone}`)
    return (
      `**Active Alerts (${alerts.length} total)**\n\n${lines.join('\n')}\n\n` +
      `Summary: ${crit.length} critical · ${warn.length} warning · ${info.length} info`
    )
  }

  // Maintenance / risk
  if (/maintenance|risk|service|repair|overdue/i.test(msg)) {
    const sorted = [...fleet].sort((a, b) => b.maintenanceRisk - a.maintenanceRisk)
    const top    = sorted[0]
    const rows   = sorted.map(u => {
      const icon = u.maintenanceRisk >= 70 ? '🔴' : u.maintenanceRisk >= 40 ? '🟡' : '🟢'
      return `${icon} **${u.name}**: ${u.maintenanceRisk}% risk — ${u.status}`
    })
    return (
      `**Maintenance Risk Report**\n\n${rows.join('\n')}\n\n` +
      `Highest risk: **${top.name}** at ${top.maintenanceRisk}%. ` +
      `${top.maintenanceRisk >= 70 ? 'Immediate service required.' : 'Monitor closely.'}`
    )
  }

  // Location / where
  if (/where|location|zone|position/i.test(msg)) {
    const match = fleet.find(u =>
      msg.includes(u.name.toLowerCase()) || msg.includes(u.id.toLowerCase())
    )
    if (match) {
      return (
        `**${match.name}** is currently at **${match.currentZone}**.\n\n` +
        `Status: ${match.status} · Operator: ${match.operatorName}\n` +
        `Fuel: ${match.fuelLevel}% · Utilization: ${match.utilization}%` +
        (match.activeRoute ? `\nActive route: ${match.activeRoute}` : '')
      )
    }
    const rows = fleet.map(u => `• **${u.name}**: ${u.currentZone} (${u.status})`)
    return `**All Unit Locations**\n\n${rows.join('\n')}`
  }

  // Idle units
  if (/idle|not active|unused|available/i.test(msg)) {
    const idle = fleet.filter(u => u.status === 'idle')
    if (!idle.length) return 'No idle units at this time. All units are operational.'
    return (
      `**Idle Units (${idle.length})**\n\n` +
      idle.map(u => `• **${u.name}** — ${u.currentZone}, operator: ${u.operatorName}`).join('\n') +
      '\n\nConsider redeployment to high-capacity zones.'
    )
  }

  // Routes / delay
  if (/route|delay|trip|path|congestion/i.test(msg)) {
    const active = fleet.filter(u => u.activeRoute)
    const congested = alerts.filter(a => /congestion/i.test(a.title))
    return (
      `**Active Routes**\n\n` +
      (active.length
        ? active.map(u => `• **${u.name}**: ${u.activeRoute}`).join('\n')
        : 'No active routes currently.') +
      (congested.length
        ? `\n\n⚠️ Congestion risk: ${congested.map(a => a.zone).join(', ')}`
        : '\n\n✅ No congestion reported.')
    )
  }

  // Yard / capacity
  if (/yard|capacity|storage|zone/i.test(msg)) {
    return (
      '**Yard Capacity**\n\n' +
      '🔴 Blue Yard: 82% — High\n' +
      '🟢 Green Yard: 45% — Normal\n' +
      '🟡 Dispatch: 73% — Moderate\n' +
      '🟢 Inspection: 35% — Low\n' +
      '🟡 MOTU: 60% — Moderate\n\n' +
      'Recommendation: redirect loads from Blue Yard to Green Yard.'
    )
  }

  // A* routing
  if (/a\*|astar|optimal|algorithm|routing|calculate/i.test(msg)) {
    return (
      '**A\* Route Planner** is available in Control Tower → Camera Monitor tab.\n\n' +
      '1. Select **Origin** (e.g. Warehouse)\n' +
      '2. Select **Destination** (e.g. MOTU)\n' +
      '3. Click **Calculate** — optimal route appears on the satellite map\n\n' +
      'The algorithm uses weighted edges between 10 plant zones to minimize travel cost.'
    )
  }

  // What can you do / help
  if (/what can|help|capabilities|features|start|hello|hi|hola/i.test(msg)) {
    const active = fleet.filter(u => u.status === 'active')
    const top    = [...fleet].sort((a, b) => b.maintenanceRisk - a.maintenanceRisk)[0]
    return (
      `Hello! I'm the **Tenaris SFS AI Assistant**.\n\n` +
      `Current status: ${active.length}/${fleet.length} units active · ` +
      `${alerts.length} active alerts · Highest risk: ${top.name} (${top.maintenanceRisk}%)\n\n` +
      `I can help with:\n` +
      `• Fleet status and unit locations\n` +
      `• Active alerts and maintenance risks\n` +
      `• Route analysis and Control Tower\n` +
      `• Yard capacity and congestion\n` +
      `• A* optimal routing\n\n` +
      `Ask me anything about your fleet operations.`
    )
  }

  // Summary / overview / fleet
  const active  = fleet.filter(u => u.status === 'active')
  const idle    = fleet.filter(u => u.status === 'idle')
  const avgUtil = Math.round(fleet.reduce((s, u) => s + u.utilization, 0) / fleet.length)
  const top     = [...fleet].sort((a, b) => b.maintenanceRisk - a.maintenanceRisk)[0]

  return (
    `**Fleet Overview — Tenaris Tamsa**\n\n` +
    fleet.map(u => {
      const icon = u.status === 'active' ? '✅' : u.status === 'warning' ? '⚠️' : u.status === 'maintenance' ? '🔴' : '⚪'
      return `${icon} **${u.name}**: ${u.status} · ${u.currentZone} · fuel ${u.fuelLevel}%`
    }).join('\n') +
    `\n\n**Summary:** ${active.length} active · ${idle.length} idle · ` +
    `${fleet.filter(u => u.status === 'warning').length} warning · ` +
    `${fleet.filter(u => u.status === 'maintenance').length} maintenance\n` +
    `Avg utilization: **${avgUtil}%** · Highest maintenance risk: **${top.name}** (${top.maintenanceRisk}%)\n\n` +
    `Active alerts: **${alerts.length}**`
  )
}

export async function POST(req: NextRequest) {
  let message = ''
  try {
    const body = await req.json() as RequestBody
    if (typeof body.message !== 'string') throw new Error('bad type')
    message = body.message.trim()
  } catch {
    return NextResponse.json(
      { reply: 'Invalid request body.', source: 'simulated' },
      { status: 400 },
    )
  }

  if (!message) {
    return NextResponse.json(
      { reply: 'Message is required.', source: 'simulated' },
      { status: 400 },
    )
  }

  const reply = generateReply(message)
  return NextResponse.json({ reply, source: 'simulated' })
}
