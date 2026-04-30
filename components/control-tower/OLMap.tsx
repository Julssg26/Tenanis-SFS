'use client'

import { useEffect, useRef } from 'react'

export default function OLMap() {
  const mapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let map: any

    const loadMap = async () => {
      // IMPORTS CORRECTOS (sin default ❌)
      const { Map, View } = await import('ol')
      const TileLayer = (await import('ol/layer/Tile')).default
      const VectorLayer = (await import('ol/layer/Vector')).default
      const OSM = (await import('ol/source/OSM')).default
      const VectorSource = (await import('ol/source/Vector')).default
      const { fromLonLat } = await import('ol/proj')

      // Crear mapa
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
          center: fromLonLat([-96.1342, 19.1738]), // Veracruz aprox (puedes cambiarlo)
          zoom: 16,
        }),
      })
    }

    loadMap()

    return () => {
      if (map) {
        map.setTarget(undefined)
      }
    }
  }, [])

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl overflow-hidden"
    />
  )
}