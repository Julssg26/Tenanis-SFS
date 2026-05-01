// lib/routing/yardGraph.ts
import type { Graph, Node } from './aStar'

// ── Zone nodes — dentro del polígono real de Tenaris Tamsa, Veracruz ──────────
// Coordenadas [lon, lat] distribuidas dentro del bbox:
//   lat: 19.1692 – 19.1843  |  lon: -96.2510 – -96.2266
export const YARD_NODES: Record<string, Node> = {
  WAREHOUSE:   { id: 'WAREHOUSE',   lon: -96.2490, lat: 19.1838 },
  LOADING_BAY: { id: 'LOADING_BAY', lon: -96.2460, lat: 19.1810 },
  PIPE_YARD:   { id: 'PIPE_YARD',   lon: -96.2420, lat: 19.1780 },
  MAINTENANCE: { id: 'MAINTENANCE', lon: -96.2480, lat: 19.1760 },
  DISPATCH:    { id: 'DISPATCH',    lon: -96.2380, lat: 19.1750 },
  INSPECTION:  { id: 'INSPECTION',  lon: -96.2350, lat: 19.1800 },
  GREEN_YARD:  { id: 'GREEN_YARD',  lon: -96.2310, lat: 19.1720 },
  MOTU:        { id: 'MOTU',        lon: -96.2290, lat: 19.1760 },
  GATE:        { id: 'GATE',        lon: -96.2440, lat: 19.1700 },
  BLUE_YARD:   { id: 'BLUE_YARD',   lon: -96.2330, lat: 19.1840 },
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
}

export const YARD_GRAPH: Graph = {
  nodes: YARD_NODES,
  edges: [
    { from: 'WAREHOUSE',   to: 'LOADING_BAY', weight: 1.2 },
    { from: 'WAREHOUSE',   to: 'MAINTENANCE', weight: 0.8 },
    { from: 'LOADING_BAY', to: 'PIPE_YARD',   weight: 1.0 },
    { from: 'LOADING_BAY', to: 'GATE',        weight: 1.5 },
    { from: 'PIPE_YARD',   to: 'DISPATCH',    weight: 1.3 },
    { from: 'PIPE_YARD',   to: 'BLUE_YARD',   weight: 1.1 },
    { from: 'PIPE_YARD',   to: 'MOTU',        weight: 2.0 },
    { from: 'MAINTENANCE', to: 'DISPATCH',    weight: 1.6 },
    { from: 'DISPATCH',    to: 'GREEN_YARD',  weight: 0.9 },
    { from: 'DISPATCH',    to: 'MOTU',        weight: 1.4 },
    { from: 'INSPECTION',  to: 'GREEN_YARD',  weight: 1.2 },
    { from: 'INSPECTION',  to: 'GATE',        weight: 1.0 },
    { from: 'GREEN_YARD',  to: 'MOTU',        weight: 0.7 },
    { from: 'GATE',        to: 'BLUE_YARD',   weight: 1.3 },
    { from: 'BLUE_YARD',   to: 'MOTU',        weight: 1.1 },
  ],
}
