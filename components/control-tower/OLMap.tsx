'use client'

import 'ol/ol.css'
import { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { LineString, Point } from 'ol/geom'
import { Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style'
import { fromLonLat } from 'ol/proj'

// ── Static mock data ───────────────────────────────────────────────────────────
const CENTER: [number, number] = [-96.128, 19.211]

const CAMERA_ROUTES = [
  {
    color: '#3b82f6', width: 3,
    coords: [[-96.1350, 19.2120], [-96.1280, 19.2080], [-96.1200, 19.2150], [-96.1150, 19.2100]] as [number, number][],
    from: 'Blue Yard', to: 'MOTU',
  },
  {
    color: '#16a34a', width: 3,
    coords: [[-96.1400, 19.2050], [-96.1310, 19.2095], [-96.1250, 19.2065]] as [number, number][],
    from: 'Storage A', to: 'Dispatch',
  },
  {
    color: '#eab308', width: 3,
    coords: [[-96.1200, 19.2175], [-96.1180, 19.2130], [-96.1110, 19.2100]] as [number, number][],
    from: 'Inspection', to: 'Green Yard',
  },
]

const FORKLIFT_UNITS = [
  { id: 'FK-32', lon: -96.1320, lat: 19.2115, color: '#16a34a' },
  { id: 'FK-31', lon: -96.1275, lat: 19.2085, color: '#eab308' },
  { id: 'FK-33', lon: -96.1255, lat: 19.2140, color: '#ef4444' },
  { id: 'FK-29', lon: -96.1355, lat: 19.2060, color: '#16a34a' },
  { id: 'FK-30', lon: -96.1185, lat: 19.2120, color: '#dc2626' },
  { id: 'FK-28', lon: -96.1305, lat: 19.2160, color: '#16a34a' },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function buildCameraLayer(): VectorLayer<VectorSource> {
  const source = new VectorSource()

  CAMERA_ROUTES.forEach((route) => {
    const line = new Feature(new LineString(route.coords.map(c => fromLonLat(c))))
    line.setStyle(new Style({
      stroke: new Stroke({ color: route.color, width: route.width, lineDash: [8, 4] }),
    }))
    source.addFeature(line)

    const makeMarker = (coord: [number, number], label: string, filled: boolean) => {
      const f = new Feature(new Point(fromLonLat(coord)))
      f.setStyle(new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: filled ? route.color : '#fff' }),
          stroke: new Stroke({ color: route.color, width: 2.5 }),
        }),
        text: new Text({
          text: label,
          offsetY: -18,
          font: 'bold 11px sans-serif',
          fill: new Fill({ color: '#1a237e' }),
          backgroundFill: new Fill({ color: 'rgba(255,255,255,0.88)' }),
          padding: [2, 4, 2, 4],
        }),
      }))
      return f
    }

    source.addFeature(makeMarker(route.coords[0], route.from, true))
    source.addFeature(makeMarker(route.coords[route.coords.length - 1], route.to, false))
  })

  return new VectorLayer({ source })
}

function buildForkliftLayer(): VectorLayer<VectorSource> {
  const source = new VectorSource()

  const patrol = new Feature(new LineString(FORKLIFT_UNITS.map(u => fromLonLat([u.lon, u.lat]))))
  patrol.setStyle(new Style({
    stroke: new Stroke({ color: '#3b82f6', width: 2, lineDash: [6, 4] }),
  }))
  source.addFeature(patrol)

  FORKLIFT_UNITS.forEach((unit) => {
    const pt = new Feature(new Point(fromLonLat([unit.lon, unit.lat])))
    pt.setStyle(new Style({
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
    }))
    source.addFeature(pt)
  })

  return new VectorLayer({ source })
}

// ── Component ──────────────────────────────────────────────────────────────────
interface OLMapProps {
  activeTab: string
}

export default function OLMap({ activeTab }: OLMapProps) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<Map | null>(null)
  const cameraLayer   = useRef<VectorLayer<VectorSource> | null>(null)
  const forkliftLayer = useRef<VectorLayer<VectorSource> | null>(null)
  const activeTabRef  = useRef(activeTab)

  // Keep ref in sync without triggering re-renders
  activeTabRef.current = activeTab

  // ── Init map — runs ONCE on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const cam = buildCameraLayer()
    const fkl = buildForkliftLayer()
    const isForklift = activeTabRef.current === 'forklift'

    cam.setVisible(!isForklift)
    fkl.setVisible(isForklift)

    cameraLayer.current   = cam
    forkliftLayer.current = fkl

    const map = new Map({
      target: containerRef.current,
      layers: [new TileLayer({ source: new OSM() }), cam, fkl],
      view: new View({
        center: fromLonLat(CENTER),
        zoom: isForklift ? 16 : 15,
      }),
    })

    mapRef.current = map

    // Force repaint after first layout
    requestAnimationFrame(() => map.updateSize())

    return () => {
      map.setTarget(undefined as unknown as HTMLElement)
      mapRef.current        = null
      cameraLayer.current   = null
      forkliftLayer.current = null
    }
  }, []) // ← empty array: runs once, no loops

  // ── Tab change — only toggle visibility + zoom ─────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    const cam = cameraLayer.current
    const fkl = forkliftLayer.current
    if (!map || !cam || !fkl) return

    const isForklift = activeTab === 'forklift'
    cam.setVisible(!isForklift)
    fkl.setVisible(isForklift)
    map.getView().animate({ zoom: isForklift ? 16 : 15, duration: 400 })
  }, [activeTab]) // ← only activeTab, no map references in dep array

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '500px' }}
    />
  )
}
