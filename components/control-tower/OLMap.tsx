'use client'

import 'ol/ol.css'
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { LineString, Point } from 'ol/geom'
import { Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style'
import { fromLonLat, transformExtent } from 'ol/proj'
import { YARD_NODES } from '@/lib/routing/yardGraph'

// ── Tenaris Tamsa real zone ────────────────────────────────────────────────────
// Provided corners [LON, LAT]
const TENARIS_CORNERS: [number, number][] = [
  [-96.24614, 19.18432],
  [-96.25097, 19.17433],
  [-96.23009, 19.16918],
  [-96.22658, 19.17840],
]

// Centroid
const CENTER: [number, number] = [
  TENARIS_CORNERS.reduce((s, c) => s + c[0], 0) / TENARIS_CORNERS.length,
  TENARIS_CORNERS.reduce((s, c) => s + c[1], 0) / TENARIS_CORNERS.length,
]

// Bounding box [minLon, minLat, maxLon, maxLat] — restrict user movement
const LON_MIN = -96.2600, LAT_MIN = 19.1620
const LON_MAX = -96.2150, LAT_MAX = 19.1920
// Convert to EPSG:3857 (OpenLayers internal projection)
const VIEW_EXTENT = transformExtent(
  [LON_MIN, LAT_MIN, LON_MAX, LAT_MAX],
  'EPSG:4326',
  'EPSG:3857',
)

// ── Camera Monitor mock routes — within real Tenaris bbox ─────────────────────
const CAMERA_ROUTES = [
  {
    color: '#3b82f6', width: 3,
    coords: [[-96.2490, 19.1838], [-96.2460, 19.1810], [-96.2420, 19.1780], [-96.2290, 19.1760]] as [number, number][],
    from: 'Warehouse', to: 'MOTU',
  },
  {
    color: '#16a34a', width: 3,
    coords: [[-96.2480, 19.1760], [-96.2380, 19.1750], [-96.2310, 19.1720]] as [number, number][],
    from: 'Maintenance', to: 'Green Yard',
  },
  {
    color: '#eab308', width: 3,
    coords: [[-96.2350, 19.1800], [-96.2330, 19.1840], [-96.2290, 19.1760]] as [number, number][],
    from: 'Inspection', to: 'MOTU',
  },
]

// ── Forklift units — within real Tenaris bbox ─────────────────────────────────
const FORKLIFT_UNITS = [
  { id: 'FK-32', lon: -96.2470, lat: 19.1820, color: '#16a34a' },
  { id: 'FK-31', lon: -96.2440, lat: 19.1790, color: '#eab308' },
  { id: 'FK-33', lon: -96.2400, lat: 19.1760, color: '#ef4444' },
  { id: 'FK-29', lon: -96.2480, lat: 19.1745, color: '#16a34a' },
  { id: 'FK-30', lon: -96.2350, lat: 19.1810, color: '#dc2626' },
  { id: 'FK-28', lon: -96.2320, lat: 19.1840, color: '#16a34a' },
]

// ── Layer builders ─────────────────────────────────────────────────────────────
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
          text: label, offsetY: -18, font: 'bold 11px sans-serif',
          fill: new Fill({ color: '#fff' }),
          backgroundFill: new Fill({ color: 'rgba(0,0,0,0.55)' }),
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
    stroke: new Stroke({ color: '#60a5fa', width: 2, lineDash: [6, 4] }),
  }))
  source.addFeature(patrol)
  FORKLIFT_UNITS.forEach((unit) => {
    const pt = new Feature(new Point(fromLonLat([unit.lon, unit.lat])))
    pt.setStyle(new Style({
      image: new CircleStyle({
        radius: 10, fill: new Fill({ color: unit.color }),
        stroke: new Stroke({ color: '#fff', width: 2.5 }),
      }),
      text: new Text({
        text: unit.id, offsetY: -22, font: 'bold 11px sans-serif',
        fill: new Fill({ color: '#fff' }),
        backgroundFill: new Fill({ color: unit.color }),
        padding: [2, 5, 2, 5],
      }),
    }))
    source.addFeature(pt)
  })
  return new VectorLayer({ source })
}

// ── A* route layer ─────────────────────────────────────────────────────────────
function buildAStarFeatures(nodeIds: string[]): Feature[] {
  const features: Feature[] = []
  const coords = nodeIds.map(id => {
    const n = YARD_NODES[id]
    return fromLonLat([n.lon, n.lat])
  })
  const line = new Feature(new LineString(coords))
  line.setStyle(new Style({
    stroke: new Stroke({ color: '#a855f7', width: 4, lineDash: [10, 5] }),
  }))
  features.push(line)
  nodeIds.forEach((id, idx) => {
    const isEndpoint = idx === 0 || idx === nodeIds.length - 1
    const pt = new Feature(new Point(coords[idx]))
    pt.setStyle(new Style({
      image: new CircleStyle({
        radius: isEndpoint ? 10 : 6,
        fill: new Fill({ color: isEndpoint ? '#7c3aed' : '#c4b5fd' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
      text: new Text({
        text: id.replace(/_/g, ' '),
        offsetY: -18,
        font: `${isEndpoint ? 'bold ' : ''}11px sans-serif`,
        fill: new Fill({ color: '#fff' }),
        backgroundFill: new Fill({ color: 'rgba(0,0,0,0.6)' }),
        padding: [2, 4, 2, 4],
      }),
    }))
    features.push(pt)
  })
  return features
}

// ── Satellite tile source (Esri — no API key required) ────────────────────────
function buildSatelliteLayer(): TileLayer<XYZ> {
  return new TileLayer({
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 19,
    }),
  })
}

// ── Component ──────────────────────────────────────────────────────────────────
export interface OLMapHandle {
  drawRoute: (nodeIds: string[]) => void
  clearRoute: () => void
}

interface OLMapProps {
  activeTab: string
}

const OLMap = forwardRef<OLMapHandle, OLMapProps>(function OLMap({ activeTab }, ref) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<Map | null>(null)
  const cameraLayer   = useRef<VectorLayer<VectorSource> | null>(null)
  const forkliftLayer = useRef<VectorLayer<VectorSource> | null>(null)
  const astarLayer    = useRef<VectorLayer<VectorSource> | null>(null)
  const activeTabRef  = useRef(activeTab)

  activeTabRef.current = activeTab

  useImperativeHandle(ref, () => ({
    drawRoute(nodeIds: string[]) {
      const map = mapRef.current
      if (!map) return
      if (astarLayer.current) { map.removeLayer(astarLayer.current); astarLayer.current = null }
      const source = new VectorSource()
      buildAStarFeatures(nodeIds).forEach(f => source.addFeature(f))
      const layer = new VectorLayer({ source, zIndex: 99 })
      map.addLayer(layer)
      astarLayer.current = layer
      const extent = source.getExtent()
      if (extent) {
        map.getView().fit(extent, { padding: [60, 60, 60, 60], duration: 600, maxZoom: 17 })
      }
    },
    clearRoute() {
      const map = mapRef.current
      if (!map || !astarLayer.current) return
      map.removeLayer(astarLayer.current)
      astarLayer.current = null
      map.getView().fit(
        new LineString(TENARIS_CORNERS.map(c => fromLonLat(c))).getExtent(),
        { padding: [60, 60, 60, 60], duration: 400, maxZoom: 16 }
      )
    },
  }))

  // ── Init map — ONCE on mount ──────────────────────────────────────────────
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
      layers: [buildSatelliteLayer(), cam, fkl],
      view: new View({
        center: fromLonLat(CENTER),
        zoom: 15,
        minZoom: 14,        // can't zoom out to see the whole world
        maxZoom: 19,
        extent: VIEW_EXTENT, // restrict pan to Tenaris zone
      }),
    })
    mapRef.current = map

    // Fit to exact Tenaris boundary on load
    requestAnimationFrame(() => {
      map.updateSize()
      const boundary = new LineString(TENARIS_CORNERS.map(c => fromLonLat(c)))
      map.getView().fit(boundary.getExtent(), {
        padding: [40, 40, 40, 40],
        maxZoom: 16,
        duration: 0,
      })
    })

    return () => {
      map.setTarget(undefined as unknown as HTMLElement)
      mapRef.current = null
      cameraLayer.current = null
      forkliftLayer.current = null
      astarLayer.current = null
    }
  }, [])

  // ── Tab change ────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    const cam = cameraLayer.current
    const fkl = forkliftLayer.current
    if (!map || !cam || !fkl) return
    const isForklift = activeTab === 'forklift'
    cam.setVisible(!isForklift)
    fkl.setVisible(isForklift)
    map.getView().animate({ zoom: isForklift ? 16 : 15, duration: 400 })
  }, [activeTab])

  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
})

export default OLMap
