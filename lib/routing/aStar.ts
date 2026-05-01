// lib/routing/aStar.ts
// Pure A* implementation — no external dependencies, no side effects

export interface Node {
  id: string
  lon: number
  lat: number
}

export interface Edge {
  from: string
  to: string
  weight: number   // cost — typically euclidean distance or manual weight
}

export interface Graph {
  nodes: Record<string, Node>
  edges: Edge[]
}

// ── Euclidean heuristic (degree-space is fine for small industrial areas) ──────
function heuristic(a: Node, b: Node): number {
  const dx = a.lon - b.lon
  const dy = a.lat - b.lat
  return Math.sqrt(dx * dx + dy * dy)
}

// ── A* search ─────────────────────────────────────────────────────────────────
// Returns ordered list of node IDs representing the optimal path,
// or null if no path exists.
export function aStar(
  graph: Graph,
  startId: string,
  goalId: string,
): string[] | null {
  const { nodes, edges } = graph

  if (!nodes[startId] || !nodes[goalId]) return null
  if (startId === goalId) return [startId]

  // Build adjacency list
  const adjacency: Record<string, Array<{ id: string; weight: number }>> = {}
  for (const edge of edges) {
    if (!adjacency[edge.from]) adjacency[edge.from] = []
    if (!adjacency[edge.to])   adjacency[edge.to]   = []
    adjacency[edge.from].push({ id: edge.to,   weight: edge.weight })
    adjacency[edge.to].push({   id: edge.from, weight: edge.weight }) // undirected
  }

  const gScore: Record<string, number> = { [startId]: 0 }
  const fScore: Record<string, number> = { [startId]: heuristic(nodes[startId], nodes[goalId]) }
  const cameFrom: Record<string, string> = {}
  const open = new Set<string>([startId])
  const closed = new Set<string>()

  while (open.size > 0) {
    // Pick node in open with lowest fScore
    let current = ''
    let lowestF = Infinity
    for (const id of open) {
      const f = fScore[id] ?? Infinity
      if (f < lowestF) { lowestF = f; current = id }
    }

    if (current === goalId) {
      // Reconstruct path
      const path: string[] = [current]
      let node = current
      while (cameFrom[node]) {
        node = cameFrom[node]
        path.unshift(node)
      }
      return path
    }

    open.delete(current)
    closed.add(current)

    for (const neighbor of (adjacency[current] ?? [])) {
      if (closed.has(neighbor.id)) continue

      const tentativeG = (gScore[current] ?? Infinity) + neighbor.weight

      if (tentativeG < (gScore[neighbor.id] ?? Infinity)) {
        cameFrom[neighbor.id] = current
        gScore[neighbor.id]   = tentativeG
        fScore[neighbor.id]   = tentativeG + heuristic(nodes[neighbor.id], nodes[goalId])
        open.add(neighbor.id)
      }
    }
  }

  return null  // no path found
}
