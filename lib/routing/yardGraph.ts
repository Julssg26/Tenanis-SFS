// lib/routing/yardGraph.ts
// Mock road graph for MVP. Replace with Supabase road network later.
//
// Strategy: zone nodes + intermediate ROAD INTERSECTION nodes.
// All routes go: zone → nearest intersection → corridors → nearest intersection → zone
// This prevents straight-line paths cutting through building footprints.
//
// Coordinate bbox: lat 19.1692–19.1843 | lon -96.2510–-96.2266
// Road corridors identified from Tenaris Tamsa satellite map:
//   ROAD_W  (lon ≈ -96.2455): western access road (N-S)
//   ROAD_CL (lon ≈ -96.2400): left-center corridor (N-S, between centros and MOTU)
//   ROAD_CC (lon ≈ -96.2355): central corridor (N-S, MOTU–APRO divider)
//   ROAD_CR (lon ≈ -96.2305): right corridor (N-S, APRO internal)
//   ROAD_H1 (lat ≈ 19.1790): main horizontal (E-W through center)
//   ROAD_H2 (lat ≈ 19.1730): lower horizontal (E-W, BM23 area)
//   ROAD_HT (lat ≈ 19.1825): upper horizontal (E-W, above centros)

import type { Graph, Node } from './aStar'

// ── Zone access nodes ──────────────────────────────────────────────────────
// Each zone is connected to the nearest road intersection, not directly to other zones.
export const YARD_NODES: Record<string, Node> = {
  // Zone nodes (origin/destination)
  WAREHOUSE:   { id: 'WAREHOUSE',   lon: -96.2490, lat: 19.1838 },
  LOADING_BAY: { id: 'LOADING_BAY', lon: -96.2460, lat: 19.1810 },
  PIPE_YARD:   { id: 'PIPE_YARD',   lon: -96.2430, lat: 19.1780 },
  MAINTENANCE: { id: 'MAINTENANCE', lon: -96.2480, lat: 19.1762 },
  DISPATCH:    { id: 'DISPATCH',    lon: -96.2385, lat: 19.1752 },
  INSPECTION:  { id: 'INSPECTION',  lon: -96.2348, lat: 19.1802 },
  GREEN_YARD:  { id: 'GREEN_YARD',  lon: -96.2312, lat: 19.1722 },
  MOTU:        { id: 'MOTU',        lon: -96.2293, lat: 19.1762 },
  GATE:        { id: 'GATE',        lon: -96.2455, lat: 19.1700 },
  BLUE_YARD:   { id: 'BLUE_YARD',   lon: -96.2332, lat: 19.1838 },

  // ── Road intersection nodes (prevents straight-line shortcuts) ────────────
  // Upper horizontal × western access
  INT_HT_W:  { id: 'INT_HT_W',  lon: -96.2455, lat: 19.1825 },
  // Upper horizontal × left corridor
  INT_HT_CL: { id: 'INT_HT_CL', lon: -96.2400, lat: 19.1825 },
  // Upper horizontal × central corridor
  INT_HT_CC: { id: 'INT_HT_CC', lon: -96.2355, lat: 19.1825 },

  // Main horizontal × western access
  INT_H1_W:  { id: 'INT_H1_W',  lon: -96.2455, lat: 19.1790 },
  // Main horizontal × left corridor
  INT_H1_CL: { id: 'INT_H1_CL', lon: -96.2400, lat: 19.1790 },
  // Main horizontal × central corridor
  INT_H1_CC: { id: 'INT_H1_CC', lon: -96.2355, lat: 19.1790 },
  // Main horizontal × right corridor
  INT_H1_CR: { id: 'INT_H1_CR', lon: -96.2305, lat: 19.1790 },

  // Lower horizontal × western access
  INT_H2_W:  { id: 'INT_H2_W',  lon: -96.2455, lat: 19.1730 },
  // Lower horizontal × left corridor
  INT_H2_CL: { id: 'INT_H2_CL', lon: -96.2400, lat: 19.1730 },
  // Lower horizontal × central corridor
  INT_H2_CC: { id: 'INT_H2_CC', lon: -96.2355, lat: 19.1730 },
  // Lower horizontal × right corridor
  INT_H2_CR: { id: 'INT_H2_CR', lon: -96.2305, lat: 19.1730 },
}

export const YARD_LABELS: Record<string, string> = {
  WAREHOUSE:   'Warehouse',
  LOADING_BAY: 'Loading Bay',
  PIPE_YARD:   'Pipe Yard',
  MAINTENANCE: 'Maintenance',
  DISPATCH:    'Dispatch',
  INSPECTION:  'Inspection',
  GREEN_YARD:  'Green Yard',
  MOTU:        'MOTU',
  GATE:        'Gate',
  BLUE_YARD:   'Blue Yard',
  // Intersection nodes (not shown in UI selectors)
  INT_HT_W:  'INT_HT_W',  INT_HT_CL: 'INT_HT_CL', INT_HT_CC: 'INT_HT_CC',
  INT_H1_W:  'INT_H1_W',  INT_H1_CL: 'INT_H1_CL', INT_H1_CC: 'INT_H1_CC',
  INT_H1_CR: 'INT_H1_CR',
  INT_H2_W:  'INT_H2_W',  INT_H2_CL: 'INT_H2_CL', INT_H2_CC: 'INT_H2_CC',
  INT_H2_CR: 'INT_H2_CR',
}

// Zone nodes only (for UI selectors — no intersection nodes)
export const ZONE_NODE_IDS = [
  'WAREHOUSE','LOADING_BAY','PIPE_YARD','MAINTENANCE',
  'DISPATCH','INSPECTION','GREEN_YARD','MOTU','GATE','BLUE_YARD',
]

export const YARD_GRAPH: Graph = {
  nodes: YARD_NODES,
  edges: [
    // ── Upper horizontal road (ROAD_HT) ────────────────────────────────────
    { from: 'INT_HT_W',  to: 'INT_HT_CL', weight: 0.55 },
    { from: 'INT_HT_CL', to: 'INT_HT_CC', weight: 0.45 },
    { from: 'WAREHOUSE',   to: 'INT_HT_W',  weight: 0.20 },
    { from: 'BLUE_YARD',   to: 'INT_HT_CC', weight: 0.20 },

    // ── Main horizontal road (ROAD_H1) ──────────────────────────────────────
    { from: 'INT_H1_W',  to: 'INT_H1_CL', weight: 0.55 },
    { from: 'INT_H1_CL', to: 'INT_H1_CC', weight: 0.45 },
    { from: 'INT_H1_CC', to: 'INT_H1_CR', weight: 0.50 },
    { from: 'LOADING_BAY', to: 'INT_H1_W',  weight: 0.20 },
    { from: 'PIPE_YARD',   to: 'INT_H1_CL', weight: 0.20 },
    { from: 'INSPECTION',  to: 'INT_H1_CC', weight: 0.20 },
    { from: 'MOTU',        to: 'INT_H1_CR', weight: 0.20 },

    // ── Lower horizontal road (ROAD_H2) ─────────────────────────────────────
    { from: 'INT_H2_W',  to: 'INT_H2_CL', weight: 0.55 },
    { from: 'INT_H2_CL', to: 'INT_H2_CC', weight: 0.45 },
    { from: 'INT_H2_CC', to: 'INT_H2_CR', weight: 0.50 },
    { from: 'GATE',        to: 'INT_H2_W',  weight: 0.25 },
    { from: 'DISPATCH',    to: 'INT_H2_CL', weight: 0.20 },
    { from: 'GREEN_YARD',  to: 'INT_H2_CR', weight: 0.20 },

    // ── Western access road (ROAD_W, N-S) ──────────────────────────────────
    { from: 'INT_HT_W', to: 'INT_H1_W', weight: 0.35 },
    { from: 'INT_H1_W', to: 'INT_H2_W', weight: 0.60 },
    { from: 'MAINTENANCE', to: 'INT_H1_W', weight: 0.25 },

    // ── Left corridor (ROAD_CL, N-S) ──────────────────────────────────────
    { from: 'INT_HT_CL', to: 'INT_H1_CL', weight: 0.35 },
    { from: 'INT_H1_CL', to: 'INT_H2_CL', weight: 0.60 },

    // ── Central corridor (ROAD_CC, N-S) ────────────────────────────────────
    { from: 'INT_HT_CC', to: 'INT_H1_CC', weight: 0.35 },
    { from: 'INT_H1_CC', to: 'INT_H2_CC', weight: 0.60 },

    // ── Right corridor (ROAD_CR, N-S) ──────────────────────────────────────
    { from: 'INT_H1_CR', to: 'INT_H2_CR', weight: 0.60 },
  ],
}

// ── Helper: find nearest graph node to a [lon, lat] coordinate ────────────
// Used to snap equipment position to the road network.
// Mock for MVP — replace with PostGIS nearest-neighbor query later.
export function nearestNode(lon: number, lat: number): string {
  let best = ''
  let bestDist = Infinity
  for (const [id, node] of Object.entries(YARD_NODES)) {
    const dx = node.lon - lon
    const dy = node.lat - lat
    const d  = dx * dx + dy * dy
    if (d < bestDist) { bestDist = d; best = id }
  }
  return best
}
