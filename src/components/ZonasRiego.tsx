import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/ZonasRiego.css";
import "../styles/LeyendaChart.css";
import { FaLeaf } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import LeyendaChart from "./LeyendaChart";

interface ZonaRiego {
  id: number;
  nombre: string;
  tipo_riego: string;
  estado: string;
  fecha: string;
  latitud: number;
  longitud: number;
  ubicacion: string;
}

const getColorByTipoRiego = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case "aspersión": return "#4fc3f7";
    case "goteo": return "#81c784";
    case "superficie": return "#ffb74d";
    default: return "#ba68c8";
  }
};

const ZonasRiego: React.FC = () => {
  const [zonas, setZonas] = useState<ZonaRiego[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/riego/zonas")
      .then((res) => setZonas(res.data))
      .catch((err) => console.error("Error cargando zonas de riego", err))
      .finally(() => setTimeout(() => setLoading(false), 300));
  }, []);

  return (
    <div className="zonas-container d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <header className="dashboard-topbar mb-4">
          <div className="d-flex align-items-center">
            <FaLeaf className="me-2 leaf-icon" />
            <h1 className="text-white mb-0">Zonas de Riego</h1>
          </div>
          <button className="user-badge" onClick={() => navigate("/usuario")}>MV</button>
        </header>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner pink" />
            <p className="spinner-text">Cargando zonas de riego...</p>
          </div>
        ) : (
          <div className="zonas-layout d-flex gap-4">
            <div className="map-section" style={{ flex: 3 }}>
              <MapContainer center={[20.86, -86.87]} zoom={8} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                {zonas.map((zona) => (
                  <Marker
                    key={zona.id}
                    position={[zona.latitud, zona.longitud]}
                    icon={L.divIcon({
                      className: "custom-marker",
                      html: `<div class='circle-marker' style='background-color: ${getColorByTipoRiego(zona.tipo_riego)}'></div>`
                    })}
                  >
                    <Popup>
                      <h3>{zona.nombre}</h3>
                      <p><strong>Ubicación:</strong> {zona.ubicacion}</p>
                      <p><strong>Tipo de riego:</strong> {zona.tipo_riego}</p>
                      <p><strong>Estado:</strong> {zona.estado}</p>
                      <p><strong>Fecha:</strong> {new Date(zona.fecha).toLocaleDateString()}</p>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="leyenda-riego-styled" style={{ flex: 1 }}>
              <LeyendaChart />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZonasRiego;
