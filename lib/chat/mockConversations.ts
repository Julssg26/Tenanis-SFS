// lib/chat/mockConversations.ts
// Replace getSimulatedReply() with Claude API call later:
//   const response = await anthropic.messages.create({ model: 'claude-opus-4-5', ... })

import type { Conversation } from './types'

function id() {
  return Math.random().toString(36).slice(2, 10)
}

export function getInitialConversations(): Conversation[] {
  return [
    {
      id: 'conv-1',
      title: 'Fleet Status Overview',
      preview: 'Crane 01 requires immediate maintenance...',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        {
          id: id(), role: 'user', content: 'Show me active alerts',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: id(), role: 'assistant',
          content: `Here are the current active alerts across the fleet:\n\n**🔴 Critical**\n- **Crane 01** — Maintenance risk at 95%. Immediate service required. Zone: Inspection.\n\n**🟡 Warning**\n- **Forklift 02** — Maintenance risk at 72%. Schedule preventive service. Zone: Pipe Yard.\n- **Forklift 02** — No operator assigned and no active route. Zone: Pipe Yard.\n\n**🔵 Info**\n- **Shuttle 01** — Utilization at 22%. Consider redeployment. Zone: Blue Yard.\n- **Yard Tractor 01** — Congestion risk on route Maintenance → Green Yard.\n\nWould you like to take action on any of these?`,
          createdAt: new Date(Date.now() - 7100000).toISOString(),
        },
        {
          id: id(), role: 'user', content: 'Which unit has the highest maintenance risk?',
          createdAt: new Date(Date.now() - 3700000).toISOString(),
        },
        {
          id: id(), role: 'assistant',
          content: `**Crane 01 (CR-01)** has the highest maintenance risk at **95%** — classified as critical.\n\nDetails:\n- **Zone:** Inspection\n- **Status:** Maintenance (out of service)\n- **Operator:** Unassigned\n- **Fuel Level:** 100% (unit is stationary)\n- **Utilization:** 0%\n\nThis unit should be prioritized for immediate servicing before returning to operations.`,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    },
    {
      id: 'conv-2',
      title: 'Control Tower Summary',
      preview: 'Current routes are operating normally...',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 82800000).toISOString(),
      messages: [
        {
          id: id(), role: 'user', content: 'Summarize Control Tower status',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: id(), role: 'assistant',
          content: `**Control Tower — Live Summary**\n\n**Active Routes (Camera Monitor)**\n- Warehouse → MOTU (Blue)\n- Maintenance → Green Yard (Green)\n- Inspection → MOTU (Yellow)\n\nAll routes are currently operating without reported delays.\n\n**Fleet Status**\n- ✅ Active: Forklift 01, Yard Tractor 01\n- ⚠️ Warning: Forklift 02\n- 🔴 Maintenance: Crane 01\n- ⚪ Idle: Shuttle 01\n\n**Yard Capacity**\n- Blue Yard: 82% (high)\n- Green Yard: 45% (normal)\n\nOverall operational readiness: **72%**. Recommend addressing Crane 01 and Forklift 02 before next shift.`,
          createdAt: new Date(Date.now() - 86300000).toISOString(),
        },
      ],
    },
  ]
}

// ── Simulated response engine ──────────────────────────────────────────────────
// Replace this function with a Claude API call when ready:
//
//   async function getClaudeReply(messages: Message[]): Promise<string> {
//     const response = await fetch('/api/chat', {
//       method: 'POST',
//       body: JSON.stringify({ messages }),
//     })
//     const data = await response.json()
//     return data.content
//   }

const RESPONSES: Array<{ match: RegExp; reply: string }> = [
  {
    match: /alert|warning|critical|notification/i,
    reply: `**Current Active Alerts:**\n\n🔴 **Critical** — Crane 01: Maintenance risk at 95%. Immediate action required.\n🟡 **Warning** — Forklift 02: Maintenance risk at 72%, no operator assigned.\n🔵 **Info** — Shuttle 01: Low utilization (22%). Yard Tractor 01: Congestion risk on active route.\n\nTotal: 2 warnings, 1 critical, 2 informational. Would you like me to generate a maintenance report?`,
  },
  {
    match: /maintenance|risk|service/i,
    reply: `**Maintenance Risk Report:**\n\n| Unit | Risk | Status |\n|------|------|--------|\n| Crane 01 | 🔴 95% | Out of service |\n| Forklift 02 | 🟡 72% | Warning |\n| Yard Tractor 01 | 🟢 25% | Active |\n| Forklift 01 | 🟢 18% | Active |\n| Shuttle 01 | 🟢 10% | Idle |\n\nI recommend scheduling Crane 01 and Forklift 02 for preventive maintenance before the next operational cycle.`,
  },
  {
    match: /fleet|unit|status|performance/i,
    reply: `**Fleet Performance Overview:**\n\n- **Active units:** 2 (Forklift 01, Yard Tractor 01)\n- **Idle:** 1 (Shuttle 01)\n- **Warning:** 1 (Forklift 02)\n- **Out of service:** 1 (Crane 01)\n\n**Average utilization:** 51.6%\n**Overall fuel level:** 80%\n\nYard Tractor 01 leads with 91% utilization. Shuttle 01 is underutilized at 22% — consider reassignment to Blue Yard to help with current 82% capacity.`,
  },
  {
    match: /route|delay|trip|path/i,
    reply: `**Route Status — Tenaris Tamsa:**\n\n✅ **Warehouse → MOTU** — Operating normally. Assigned: Forklift 01.\n✅ **Maintenance → Green Yard** — Operating normally. Assigned: Yard Tractor 01.\n⚠️ **Inspection → MOTU** — Minor congestion indicator detected.\n\nNo significant delays reported in the last shift. The A* route planner can suggest optimal alternative paths if congestion increases.`,
  },
  {
    match: /yard|capacity|congestion|zone/i,
    reply: `**Yard Capacity Report:**\n\n- 🔴 **Blue Yard:** 82% — High. Risk of congestion if throughput continues.\n- 🟢 **Green Yard:** 45% — Normal operational level.\n- 🟡 **Dispatch Zone:** 73% — Moderate activity.\n- 🟢 **Inspection Zone:** 35% — Low.\n- 🟡 **MOTU:** 60% — Moderate.\n\nRecommendation: Redirect 2–3 loads from Blue Yard to Green Yard to balance capacity before end of shift.`,
  },
  {
    match: /a\*|algorithm|astar|optimal|path/i,
    reply: `The **A\* Route Algorithm** is active in Control Tower → Camera Monitor tab.\n\nYou can:\n1. Select an **Origin** zone (e.g. Warehouse, Loading Bay)\n2. Select a **Destination** zone (e.g. MOTU, Green Yard)\n3. Click **Calculate** to see the optimal route drawn on the satellite map\n\nThe algorithm uses weighted edges between 10 plant zones to minimize travel cost, accounting for distance and congestion factors. Future versions will incorporate real-time Sensolus GPS data.`,
  },
  {
    match: /hello|hi|hola|hey|start|begin/i,
    reply: `Hello! I'm the **Tenaris SFS AI Assistant**. I can help you with:\n\n- 📊 **Fleet status** and unit performance\n- 🚨 **Active alerts** and maintenance risks\n- 🗺️ **Route analysis** and Control Tower updates\n- 📦 **Yard capacity** and zone congestion\n- 🤖 **A\* routing** explanations\n\nWhat would you like to know about your fleet operations today?`,
  },
  {
    match: /report|summary|overview/i,
    reply: `**Operational Summary — Tenaris Tamsa**\n\n**Shift Status:** Active | 3 routes operational\n**Fleet Readiness:** 72% (3/5 units operational)\n**Critical Issues:** 1 (Crane 01)\n**Pending Warnings:** 2\n\n**Key Metrics:**\n- Avg utilization: 51.6%\n- Blue Yard capacity: 82% ⚠️\n- Active operators: 3\n\n**Recommended Actions:**\n1. Service Crane 01 immediately\n2. Assign operator to Forklift 02\n3. Redirect Blue Yard loads to Green Yard\n\nShall I generate a detailed PDF report? *(Feature coming with Supabase integration)*`,
  },
]

const DEFAULT_REPLY = `I understand your query. Based on current fleet data from Tenaris Tamsa:\n\nAll systems are being monitored in real-time. For specific information, try asking:\n- "Show active alerts"\n- "Fleet performance summary"\n- "Which unit needs maintenance?"\n- "Yard capacity status"\n- "Current route delays"\n\n*Note: Full AI capabilities will be available when Claude API integration is enabled.*`

export function getSimulatedReply(userMessage: string): string {
  for (const { match, reply } of RESPONSES) {
    if (match.test(userMessage)) return reply
  }
  return DEFAULT_REPLY
}

export function createConversation(firstMessage: string): Conversation {
  const now = new Date().toISOString()
  // Title = first 40 chars of message
  const title = firstMessage.length > 40
    ? firstMessage.slice(0, 40) + '…'
    : firstMessage
  return {
    id: `conv-${id()}`,
    title,
    preview: firstMessage,
    createdAt: now,
    updatedAt: now,
    messages: [],
  }
}
