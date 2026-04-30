'use client'

import { useEffect, useRef } from 'react'

// ── Mock data ──────────────────────────────────────────────────────────────────
// Tenaris Tamsa plant — Veracruz, Mexico
const CENTER_LON = -96.1280
const CENTER_LAT =  19.2110
const ZOOM = 15

// Camera Monitor: routes as polylines (lon, lat pairs)
const CAMERA_ROUTES = [
  {
    id: 'RT-01', color: '#3b82f6', width: 3,
    coords: [[-96.1350, 19.2120], [-96.1280, 19.2080], [-96.1200, 19.2150], [-96.1150, 19.2100]],
    from: 'Blue Yard', to: 'MOTU',
  },
  {
    id: 'RT-02', color: '#16a34a', width: 3,
    coords: [[-96.1400, 19.2050], [-96.1310, 19.2095], [-96.1250, 19.2065]],
    from: 'Storage A', to: 'Dispatch',
  },
  {
    id: 'RT-03', color: '#eab308', width: 3,
    coords: [[-96.1200, 19.2175], [-96.1180, 19.2130], [-96.1110, 19.2100]],
    from: 'Inspection', to: 'Green Yard',
  },
]

// Forklift Tracking: individual units with status
const FORKLIFT_UNITS = [
  { id: 'FK-32', lon: -96.1320, lat: 19.2115, status: 'active',   color: '#16a34a', label: 'Loading Area A' },
  { id: 'FK-31', lon: -96.1275, lat: 19.2085, status: 'loading',  color: '#eab308', label: 'Loading Area 2' },
  { id: 'FK-33', lon: -96.1255, lat: 19.2140, status: 'idle',     color: '#ef4444', label: 'Loading Area B' },
  { id: 'FK-29', lon: -96.1355, lat: 19.2060, status: 'active',   color: '#16a34a', label: 'Zone BM-23'     },
  { id: 'FK-30', lon: -96.1185, lat: 19.2120, status: 'critical', color: '#dc2626', label: 'Maintenance'    },
  { id: 'FK-28', lon: -96.1305, lat: 19.2160, status: 'active',   color: '#16a34a', label: 'Zone BM-31'     },
]

interface OLMapProps {
  activeTab: string
}

export default function OLMap({ activeTab }: OLMapProps) {
  const mapRef    = useRef<HTMLDivElement>(null)
  const mapInst   = useRef<unknown>(null)
  const layersRef = useRef<unknown[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    let map: unknown
    let cleanup = () => {}

    // Dynamic import so OL only loads client-side (SSR-safe, Vercel-safe)
    import('ol').then(async (olMod) => {
      const ol        = olMod.default ?? olMod
      const { Map, View }           = await import('ol')
      const { Tile: TileLayer, Vector: VectorLayer } = await import('ol/layer')
      const { OSM, Vector: VectorSource }            = await import('ol/source')
      const { fromLonLat }                           = await import('ol/proj')
      const { Feature }                              = await import('ol')
      const { LineString, Point }                    = await import('ol/geom')
      const { Style, Stroke, Fill, Circle: CircleStyle, Text } = await import('ol/style')

      if (!mapRef.current) return

      // Remove previous map instance if any
      if (mapInst.current) {
        (mapInst.current as { setTarget: (t: undefined) => void }).setTarget(undefined)
      }

      // Base tile layer (OpenStreetMap)
      const baseLayer = new TileLayer({ source: new OSM() })

      // ── Camera Monitor layers ──────────────────────────────────────────────
      const cameraSource = new VectorSource()

      CAMERA_ROUTES.forEach((route) => {
        // Route line
        const line = new Feature({
          geometry: new LineString(route.coords.map(([lon, lat]) => fromLonLat([lon, lat]))),
        })
        line.setStyle(
          new Style({
            stroke: new Stroke({ color: route.color, width: route.width, lineDash: [8, 4] }),
          })
        )
        cameraSource.addFeature(line)

        // Origin marker
        const origin = new Feature({
          geometry: new Point(fromLonLat(route.coords[0])),
          label: route.from,
        })
        origin.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 8,
              fill: new Fill({ color: route.color }),
              stroke: new Stroke({ color: '#fff', width: 2 }),
            }),
            text: new Text({
              text: route.from,
              offsetY: -18,
              font: 'bold 11px sans-serif',
              fill: new Fill({ color: '#1a237e' }),
              backgroundFill: new Fill({ color: 'rgba(255,255,255,0.85)' }),
              padding: [2, 4, 2, 4],
            }),
          })
        )
        cameraSource.addFeature(origin)

        // Destination marker
        const dest = new Feature({
          geometry: new Point(fromLonLat(route.coords[route.coords.length - 1])),
          label: route.to,
        })
        dest.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 8,
              fill: new Fill({ color: '#fff' }),
              stroke: new Stroke({ color: route.color, width: 3 }),
            }),
            text: new Text({
              text: route.to,
              offsetY: -18,
              font: 'bold 11px sans-serif',
              fill: new Fill({ color: '#1a237e' }),
              backgroundFill: new Fill({ color: 'rgba(255,255,255,0.85)' }),
              padding: [2, 4, 2, 4],
            }),
          })
        )
        cameraSource.addFeature(dest)
      })

      const cameraLayer = new VectorLayer({
        source: cameraSource,
        visible: activeTab === 'camera',
      })

      // ── Forklift Tracking layer ────────────────────────────────────────────
      const forkliftSource = new VectorSource()

      // Route connecting all forklifts (patrol path)
      const patrolCoords = FORKLIFT_UNITS.map((u) => fromLonLat([u.lon, u.lat]))
      const patrolLine = new Feature({ geometry: new LineString(patrolCoords) })
      patrolLine.setStyle(
        new Style({
          stroke: new Stroke({ color: '#3b82f6', width: 2, lineDash: [6, 4] }),
        })
      )
      forkliftSource.addFeature(patrolLine)

      FORKLIFT_UNITS.forEach((unit) => {
        const pt = new Feature({
          geometry: new Point(fromLonLat([unit.lon, unit.lat])),
        })
        pt.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 10,
              fill: new Fill({ color: unit.color }),
              stroke: new Stroke({ color: '#fff', width: 2.5 }),
            }),
            text: new Text({
              text: unit.id,
              offsetY: -22,
              font: 'bold 11px sans-serif',
              fill: new Fill({ color: '#fff' }),
              backgroundFill: new Fill({ color: unit.color }),
              padding: [2, 5, 2, 5],
            }),
          })
        )
        forkliftSource.addFeature(pt)
      })

      const forkliftLayer = new VectorLayer({
        source: forkliftSource,
        visible: activeTab === 'forklift',
      })

      layersRef.current = [cameraLayer, forkliftLayer]

      // ── Build map ──────────────────────────────────────────────────────────
      map = new Map({
        target: mapRef.current!,
        layers: [baseLayer, cameraLayer, forkliftLayer],
        view: new View({
          center: fromLonLat([CENTER_LON, CENTER_LAT]),
          zoom: ZOOM,
        }),
      })

      mapInst.current = map

      cleanup = () => {
        if (map) (map as { setTarget: (t: undefined) => void }).setTarget(undefined)
      }
    }).catch((err) => {
      console.warn('OpenLayers failed to load:', err)
    })

    return () => cleanup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // mount only

  // Toggle layer visibility when tab changes (no full rebuild)
  useEffect(() => {
    const [cameraLayer, forkliftLayer] = layersRef.current as Array<{
      setVisible: (v: boolean) => void
    }>
    if (!cameraLayer || !forkliftLayer) return
    cameraLayer.setVisible(activeTab === 'camera')
    forkliftLayer.setVisible(activeTab === 'forklift')
  }, [activeTab])

  return (
    <div
      ref={mapRef}
      className="w-full rounded-b-xl overflow-hidden"
      style={{ height: 520 }}
    />
  )
}
