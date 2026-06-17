'use client'

import { useEffect, useRef, useState } from 'react'
import * as React from 'react'

export default function BEIGlobe({ width = 680, height = 680 }: { width?: number; height?: number }) {
  const [GlobeComponent, setGlobeComponent] = useState<any>(null)

  useEffect(() => {
    import('react-globe.gl').then((mod) => {
      setGlobeComponent(() => mod.default)
    })
  }, [])

  const arcsData = [
    { startLat: 51.5, startLng: -0.1, endLat: 40.7, endLng: -74.0 },
    { startLat: 51.5, startLng: -0.1, endLat: 52.5, endLng: 13.4 },
    { startLat: 40.7, startLng: -74.0, endLat: 37.8, endLng: -122.4 },
    { startLat: 35.7, startLng: 139.7, endLat: 1.3, endLng: 103.8 },
    { startLat: 1.3, startLng: 103.8, endLat: 19.0, endLng: 72.8 },
    { startLat: 37.8, startLng: -122.4, endLat: -23.5, endLng: -46.6 },
    { startLat: 52.5, startLng: 13.4, endLat: 55.7, endLng: 37.6 },
    { startLat: -33.9, startLng: 151.2, endLat: 1.3, endLng: 103.8 },
    { startLat: 25.2, startLng: 55.3, endLat: 19.0, endLng: 72.8 },
    { startLat: 31.2, startLng: 121.5, endLat: 35.7, endLng: 139.7 },
    { startLat: 53.4, startLng: -2.2, endLat: 51.5, endLng: -0.1 },
    { startLat: 48.8, startLng: 2.3, endLat: 52.5, endLng: 13.4 },
  ]

  const pointsData = [
    { lat: 51.5, lng: -0.1 }, { lat: 40.7, lng: -74.0 },
    { lat: 35.7, lng: 139.7 }, { lat: 52.5, lng: 13.4 },
    { lat: 1.3, lng: 103.8 }, { lat: 37.8, lng: -122.4 },
    { lat: -33.9, lng: 151.2 }, { lat: 25.2, lng: 55.3 },
    { lat: 48.8, lng: 2.3 }, { lat: 19.0, lng: 72.8 },
    { lat: 53.4, lng: -2.2 }, { lat: -23.5, lng: -46.6 },
    { lat: 55.7, lng: 37.6 }, { lat: 31.2, lng: 121.5 },
  ]

  if (!GlobeComponent) {
    return <div style={{ width, height, backgroundColor: 'transparent' }} />
  }

  return (
    <GlobeComponent
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      atmosphereColor="#1a3a8a"
      atmosphereAltitude={0.20}
      arcsData={arcsData}
      arcColor={() => '#C8A24A'}
      arcAltitude={0.22}
      arcStroke={0.5}
      arcDashLength={0.35}
      arcDashGap={0.65}
      arcDashAnimateTime={2800}
      arcOpacity={0.75}
      pointsData={pointsData}
      pointColor={() => '#C8A24A'}
      pointAltitude={0.01}
      pointRadius={0.5}
      animateIn={false}
      enablePointerInteraction={false}
    />
  )
}
