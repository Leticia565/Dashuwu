import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/ZonasInactivas.css";
import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ZonaInactiva {
  id: number;
  nombre: string;
  ubicacion: string;
  tipo_riego: string;
  estado: string;
  motivo: string;
  fecha: string;
}

const ZonasInactivas: React.FC = () => {
  const [zonasInactivas, setZonasInactivas] = useState<ZonaInactiva[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/riego/inactivas")
      .then((res) => setZonasInactivas(res.data))
      .catch((err) => console.error("Error al cargar zonas inactivas", err))
      .finally(() => setTimeout(() => setLoading(false), 100));
  }, []);

  const estadosCount = zonasInactivas.reduce((acc, zona) => {
    acc[zona.estado] = (acc[zona.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(estadosCount),
    datasets: [
      {
        label: "Zonas por estado",
        data: Object.values(estadosCount),
        backgroundColor: ["#f06292", "#ba68c8", "#64b5f6", "#81c784", "#ffb74d"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="zonas-inactivas-container d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <header className="dashboard-topbar mb-4">
          <div className="d-flex align-items-center">
            <FaLeaf className="me-2 leaf-icon" />
            <h1 className="text-white mb-0">Zonas de Riego Sin Funcionamiento</h1>
          </div>
          <button className="user-badge" onClick={() => navigate("/usuario")}>MV</button>
        </header>

        <div className="zona-table-container">
          <div className="title-and-filters">
            <h2 className="table-title">Historial de las zonas que están inactivas</h2>
            <div className="zona-chart">
              <Pie data={chartData} />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Tipo de riego</th>
                <th>Estado</th>
                <th>Motivo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {zonasInactivas.map((zona) => (
                <tr key={zona.id}>
                  <td data-label="ID">{zona.id}</td>
                  <td data-label="Nombre">{zona.nombre}</td>
                  <td data-label="Ubicación">{zona.ubicacion}</td>
                  <td data-label="Tipo de riego">{zona.tipo_riego}</td>
                  <td data-label="Estado" className="estado">{zona.estado}</td>
                  <td data-label="Motivo" className="motivo">{zona.motivo}</td>
                  <td data-label="Fecha">{new Date(zona.fecha).toLocaleDateString("es-ES")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="spinner-container">
            {loading && <div className="spinner pink"></div>}
            {loading && <p className="spinner-text">Cargando zonas inactivas...</p>}
            {!loading && zonasInactivas.length === 0 && (
              <div className="no-data">⚠️ No se encontraron zonas inactivas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonasInactivas;
