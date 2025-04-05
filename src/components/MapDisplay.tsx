"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import axios from "axios"

export interface Parcela {
  id: number
  nombre: string
  tipo_cultivo: string
  responsable: string
  latitud: number
  longitud: number
  ultimo_riego: string
}

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Coordenadas centrales de Quintana Roo (cerca de Cancún)
const QUINTANA_ROO_CENTER: [number, number] = [20.8697, -86.8677]
const DEFAULT_ZOOM = 10

// Componente para ajustar la vista del mapa
function MapController({ parcelas }: { parcelas: Parcela[] }) {
  const map = useMap()

  useEffect(() => {
    // Primero, centrar en Quintana Roo
    map.setView(QUINTANA_ROO_CENTER, DEFAULT_ZOOM)

    // Si hay parcelas, ajustar a los marcadores
    if (parcelas.length > 0) {
      try {
        const bounds = L.latLngBounds(parcelas.map((parcela) => [parcela.latitud, parcela.longitud]))

        // Solo ajustar si los bounds son válidos
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
        }
      } catch (error) {
        console.error("Error al ajustar el mapa:", error)
        // En caso de error, mantener la vista en Quintana Roo
        map.setView(QUINTANA_ROO_CENTER, DEFAULT_ZOOM)
      }
    }
  }, [parcelas, map])

  return null
}

function MapDisplay() {
  const [parcelas, setParcelas] = useState<Parcela[]>([])

  useEffect(() => {
    axios
      .get("http://localhost:3000/sensores/dashboard")
      .then((res) => {
        setParcelas(res.data.parcelas)
      })
      .catch((err) => {
        console.error("Error al obtener parcelas:", err)
        // Si hay un error al cargar las parcelas, dejamos el array vacío
        // y el mapa se centrará en Quintana Roo por defecto
      })
  }, [])

  return (
    <div className="map-container">
      <MapContainer
        // Inicializar el mapa en Quintana Roo
        center={QUINTANA_ROO_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parcelas.map((parcela) => (
          <Marker key={parcela.id} position={[parcela.latitud, parcela.longitud]} icon={customIcon}>
            <Popup>
              <strong>{parcela.nombre}</strong>
              <br />
              Cultivo: {parcela.tipo_cultivo}
              <br />
              Responsable: {parcela.responsable}
              <br />
              Último riego: {new Date(parcela.ultimo_riego).toLocaleString()}
            </Popup>
          </Marker>
        ))}
        {/* Componente que ajusta la vista cuando cambian las parcelas */}
        <MapController parcelas={parcelas} />
      </MapContainer>
    </div>
  )
}

export default MapDisplay

