'use client'

import { useEffect, useRef } from 'react'

type OLMapProps = {
  activeTab?: string
}

export default function OLMap({ activeTab = 'camera' }: OLMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let map: any

    const loadMap = async () => {
      const { Map, View } = await import('ol')
      const TileLayer = (await import('ol/layer/Tile')).default
      const VectorLayer = (await import('ol/layer/Vector')).default
      const OSM = (await import('ol/source/OSM')).default
      const VectorSource = (await import('ol/source/Vector')).default
      const { fromLonLat } = await import('ol/proj')

      map = new Map({
        target: mapRef.current!,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: new VectorSource(),
          }),
        ],
        view: new View({
          center: fromLonLat([-96.1342, 19.1738]),
          zoom: activeTab === 'forklift' ? 17 : 16,
        }),
      })
    }

    loadMap()

    return () => {
      if (map) {
        map.setTarget(undefined)
      }
    }
  }, [activeTab])

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl overflow-hidden"
    />
  )
}