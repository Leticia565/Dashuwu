import { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "./Sidebar";
import "../styles/HistoricalCharts.css";
import { FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function HistoricalCharts() {
  const [labels, setLabels] = useState<string[]>([]);
  const [temperatura, setTemperatura] = useState<number[]>([]);
  const [humedad, setHumedad] = useState<number[]>([]);
  const [lluvia, setLluvia] = useState<number[]>([]);
  const [sol, setSol] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/sensores/historial")
      .then((res) => {
        const data = res.data;
        const ultimos = data.slice(-15);

        setLabels(
          ultimos.map((item: { fecha: string }) =>
            new Date(item.fecha).toLocaleString()
          )
        );
        setTemperatura(ultimos.map((item: { temperatura: any; }) => item.temperatura));
        setHumedad(ultimos.map((item: { humedad: any; }) => item.humedad));
        setLluvia(ultimos.map((item: { lluvia: any; }) => item.lluvia));
        setSol(ultimos.map((item: { intensidad_solar: any; }) => item.intensidad_solar));
      })
      .catch((error) => {
        console.error("❌ Error al obtener historial:", error);
      })
      .finally(() => setTimeout(() => setLoading(false), 100)); // menos de un segundo
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
    },
  };

  return (
    <div className="main-layout">
      <div className="d-flex historical-container">
        <Sidebar />
        <div className="historical-content">
          <header className="dashboard-topbar mb-4">
            <div className="d-flex align-items-center">
              <FaLeaf className="me-2 leaf-icon" />
              <h1 className="text-white mb-0">Historial de las Parcelas</h1>
            </div>
            <button className="user-badge" title="Ir a perfil" onClick={() => navigate("/usuario")}>
              MV
            </button>
          </header>

          {loading ? (
            <div className="spinner-charts-container">
              <div className="spinner pink"></div>
              <p className="spinner-text">Cargando datos...</p>
            </div>
          ) : (
            <div className="charts-container">
              <div className="charts-row">
                <div className="chart-box">
                  <h2>Temperatura</h2>
                  <div className="chart-content">
                    <Line
                      options={chartOptions}
                      data={{
                        labels,
                        datasets: [
                          {
                            label: "Temperatura °C",
                            data: temperatura,
                            borderColor: "#e83e8c",
                            backgroundColor: "rgba(232, 62, 140, 0.2)",
                            tension: 0.3,
                            borderWidth: 3,
                            pointBackgroundColor: "#e83e8c",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                          },
                        ],
                      }}
                    />
                  </div>
                </div>

                <div className="chart-box">
                  <h2>Humedad</h2>
                  <div className="chart-content">
                    <Bar
                      options={chartOptions}
                      data={{
                        labels,
                        datasets: [
                          {
                            label: "Humedad %",
                            data: humedad,
                            backgroundColor: "rgba(232, 62, 140, 0.6)",
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: "rgba(232, 62, 140, 0.8)",
                          },
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="charts-row">
                <div className="chart-box">
                  <h2>Lluvia</h2>
                  <div className="chart-content">
                    <Bar
                      options={chartOptions}
                      data={{
                        labels,
                        datasets: [
                          {
                            label: "Lluvia (mm)",
                            data: lluvia,
                            backgroundColor: "rgba(100, 181, 246, 0.6)",
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: "rgba(100, 181, 246, 0.8)",
                          },
                        ],
                      }}
                    />
                  </div>
                </div>

                <div className="chart-box">
                  <h2>Intensidad Solar</h2>
                  <div className="chart-content full-width">
                    <Doughnut
                      options={{ ...chartOptions, cutout: "65%" }}
                      data={{
                        labels: ["Alta", "Media", "Baja"],
                        datasets: [
                          {
                            label: "Intensidad Solar (W/m²)",
                            data: [
                              sol.filter((v) => v > 700).length,
                              sol.filter((v) => v >= 400 && v <= 700).length,
                              sol.filter((v) => v < 400).length,
                            ],
                            backgroundColor: [
                              "rgba(255, 179, 0, 0.8)",
                              "rgba(255, 107, 157, 0.8)",
                              "rgba(100, 181, 246, 0.8)",
                            ],
                            borderColor: [
                              "rgba(255, 179, 0, 1)",
                              "rgba(255, 107, 157, 1)",
                              "rgba(100, 181, 246, 1)",
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoricalCharts;
