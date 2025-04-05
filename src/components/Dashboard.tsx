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
import { FaTemperatureHigh, FaTint, FaSun, FaLeaf, FaMapMarkerAlt, FaUser, FaCalendarAlt } from "react-icons/fa"
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
        const bounds = L.latLngBounds(parcelas.map((parcela) => [parcela.latitud, parcela.longitud]))

        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
        }
      } catch (error) {
        console.error("Error al ajustar el mapa:", error)
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
  .popup-header {
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 10px;
    padding-bottom: 8px;
  }
  .popup-title {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
  }
  .popup-subtitle {
    font-size: 14px;
    color: #7f8c8d;
    margin-top: 4px;
  }
  .popup-info-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
  }
  .popup-info-row svg {
    margin-right: 8px;
    min-width: 16px;
    color: #3498db;
  }
  .popup-section {
    margin-top: 12px;
  }
  .popup-section-title {
    font-weight: bold;
    margin-bottom: 6px;
    color: #2c3e50;
    font-size: 15px;
  }
  .popup-sensor-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .popup-sensor-item {
    background-color: #f5f5f5;
    padding: 6px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .popup-sensor-label {
    font-size: 12px;
    color: #7f8c8d;
  }
  .popup-sensor-value {
    font-weight: bold;
    color: #2c3e50;
  }
  .popup-footer {
    margin-top: 12px;
    font-size: 12px;
    color: #95a5a6;
    text-align: right;
    border-top: 1px solid #e0e0e0;
    padding-top: 8px;
  }
`

const Dashboard: React.FC = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [selected, setSelected] = useState<Parcela | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
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
  }, [])

  const getMarkerColor = (parcela: Parcela) => {
    if (parcela.tipo_cultivo.includes("Maíz")) return "#e83e8c"
    if (parcela.tipo_cultivo.includes("Frijol")) return "#28a745"
    if (parcela.tipo_cultivo.includes("Tomate")) return "#dc3545"
    return "#007bff" 
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  const sensor = sensorData || {
    temperatura: 0,
    humedad: 0,
    lluvia: 0,
    sol: 0,
  }

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

        <div className="dashboard-layout">
          <div className="map-section">
            <style>{popupStyle}</style>

            <MapContainer
              center={QUINTANA_ROO_CENTER}
              zoom={DEFAULT_ZOOM}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              className="custom-popup"
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {parcelas.map((parcela) => (
                <Marker
                  key={parcela.id}
                  position={[parcela.latitud, parcela.longitud]}
                  icon={createCustomIcon(getMarkerColor(parcela))}
                  eventHandlers={{
                    click: () => {
                      setSelected(parcela)
                      setLastUpdated(new Date())
                    },
                  }}
                >
                  <Popup minWidth={280} maxWidth={320}>
                    <div className="popup-header">
                      <h3 className="popup-title">{parcela.nombre}</h3>
                      <div className="popup-subtitle">ID: {parcela.id}</div>
                    </div>

                    <div className="popup-info-row">
                      <FaLeaf />{" "}
                      <span>
                        Cultivo: <strong>{parcela.tipo_cultivo}</strong>
                      </span>
                    </div>

                    <div className="popup-info-row">
                      <FaUser />{" "}
                      <span>
                        Responsable: <strong>{parcela.responsable}</strong>
                      </span>
                    </div>

                    <div className="popup-info-row">
                      <FaCalendarAlt />{" "}
                      <span>
                        Último riego: <strong>{formatDate(parcela.ultimo_riego)}</strong>
                      </span>
                    </div>

                    <div className="popup-info-row">
                      <FaMapMarkerAlt />{" "}
                      <span>
                        Coordenadas:{" "}
                        <strong>
                          {parcela.latitud.toFixed(6)}, {parcela.longitud.toFixed(6)}
                        </strong>
                      </span>
                    </div>

                    <div className="popup-section">
                      <div className="popup-section-title">Datos de sensores</div>
                      <div className="popup-sensor-grid">
                        <div className="popup-sensor-item">
                          <FaTemperatureHigh />
                          <div className="popup-sensor-label">Temperatura</div>
                          <div className="popup-sensor-value">{sensor.temperatura}°C</div>
                        </div>
                        <div className="popup-sensor-item">
                          <FaTint />
                          <div className="popup-sensor-label">Humedad</div>
                          <div className="popup-sensor-value">{sensor.humedad}%</div>
                        </div>
                        <div className="popup-sensor-item">
                          <BsCloudRain />
                          <div className="popup-sensor-label">Lluvia</div>
                          <div className="popup-sensor-value">{sensor.lluvia} mm</div>
                        </div>
                        <div className="popup-sensor-item">
                          <FaSun />
                          <div className="popup-sensor-label">Sol</div>
                          <div className="popup-sensor-value">{sensor.sol} W/m²</div>
                        </div>
                      </div>
                    </div>

                    <div className="popup-footer">Actualizado: {format(lastUpdated, "HH:mm:ss", { locale: es })}</div>
                  </Popup>
                </Marker>
              ))}
              <MapController parcelas={parcelas} />
            </MapContainer>
          </div>

          <div className="sensors-grid">
            <SensorCard
              label="Temperatura"
              value={`${sensor.temperatura} °C`}
              trend="stable"
              icon={<FaTemperatureHigh />}
            />
            <SensorCard label="Humedad" value={`${sensor.humedad} %`} trend="stable" icon={<FaTint />} />
            <SensorCard label="Lluvia" value={`${sensor.lluvia} mm`} icon={<BsCloudRain />} />
            <SensorCard label="Intensidad del sol" value={`${sensor.sol} W/m²`} icon={<FaSun />} />
          </div>
        </div>

        <div className="last-updated-container">
          <span className="last-updated-text">
            Última actualización: {format(lastUpdated, "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

