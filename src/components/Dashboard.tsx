"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "./Sidebar"
import SensorCard from "./SensorCard"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "../styles/Dashboard.css"
import {
  FaTemperatureHigh, FaTint, FaSun, FaLeaf,
} from "react-icons/fa"
import { BsCloudRain } from "react-icons/bs"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface SensorData {
  temperatura: number
  humedad: number
  lluvia: number
  sol: number
}

interface Parcela {
  id: number
  nombre: string
  tipo_cultivo: string
  responsable: string
  latitud: number
  longitud: number
  ultimo_riego: string
}

const QUINTANA_ROO_CENTER: [number, number] = [20.8697, -86.8677]
const DEFAULT_ZOOM = 10

function MapController({ parcelas }: { parcelas: Parcela[] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(QUINTANA_ROO_CENTER, DEFAULT_ZOOM)

    if (parcelas.length > 0) {
      try {
        const bounds = L.latLngBounds(parcelas.map((p) => [p.latitud, p.longitud]))
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
        }
      } catch {
        map.setView(QUINTANA_ROO_CENTER, DEFAULT_ZOOM)
      }
    }
  }, [parcelas, map])

  return null
}

const createCustomIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })

const popupStyle = `
  .custom-popup .leaflet-popup-content-wrapper {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    box-shadow: 0 3px 14px rgba(0,0,0,0.2);
    max-width: 300px;
  }
  .custom-popup .leaflet-popup-content {
    margin: 12px;
    width: 260px !important;
  }
  ...
`

const Dashboard: React.FC = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [selected, setSelected] = useState<Parcela | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get("http://localhost:3000/sensores/dashboard")
      .then((res) => {
        const data = res.data
        setSensorData(data.sensores)
        setParcelas(data.parcelas)
        if (data.parcelas.length > 0) {
          setSelected(data.parcelas[0])
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del dashboard:", err)
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 100)
      })
  }, [])

  const sensor = sensorData || { temperatura: 0, humedad: 0, lluvia: 0, sol: 0 }

  return (
    <div className="d-flex dashboard-container">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <header className="dashboard-topbar mb-4">
          <div className="d-flex align-items-center">
            <FaLeaf className="me-2 leaf-icon" />
            <h1 className="text-white mb-0">Mapa de Ubicaciones de las Parcelas del Sur</h1>
          </div>
          <button className="user-badge" onClick={() => navigate("/usuario")}>
            MV
          </button>
        </header>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner pink" />
            <p className="spinner-text">Cargando datos...</p>
          </div>
        ) : (
          <>
            <div className="dashboard-layout">
              <div className="map-section">
                <style>{popupStyle}</style>
                <MapContainer center={QUINTANA_ROO_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }} className="custom-popup">
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {parcelas.map((parcela) => (
                    <Marker
                      key={parcela.id}
                      position={[parcela.latitud, parcela.longitud]}
                      icon={createCustomIcon("#e754a5")}
                      eventHandlers={{ click: () => { setSelected(parcela); setLastUpdated(new Date()) } }}
                    >
                      <Popup>
                        <div className="popup-header">
                          <h3 className="popup-title">{parcela.nombre}</h3>
                          <div className="popup-subtitle">ID: {parcela.id}</div>
                        </div>
                        ...
                      </Popup>
                    </Marker>
                  ))}
                  <MapController parcelas={parcelas} />
                </MapContainer>
              </div>

              <div className="sensors-grid">
                <SensorCard label="Temperatura" value={`${sensor.temperatura} °C`} trend="stable" icon={<FaTemperatureHigh />} />
                <SensorCard label="Humedad" value={`${sensor.humedad} %`} trend="stable" icon={<FaTint />} />
                <SensorCard label="Lluvia" value={`${sensor.lluvia} mm`} icon={<BsCloudRain />} />
                <SensorCard label="Sol" value={`${sensor.sol} W/m²`} icon={<FaSun />} />
              </div>
            </div>

            <div className="last-updated-container">
              <span className="last-updated-text">
                Última actualización: {format(lastUpdated, "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es })}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
