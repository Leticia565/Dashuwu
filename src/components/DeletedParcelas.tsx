import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../Styles/DeletedParcelas.css";

interface Parcela {
  id: number;
  nombre: string;
  ubicacion: string;
  tipo_cultivo: string;
  responsable: string;
  ultimo_riego: string;
  fechaEliminada: string;
}

function DeletedParcelas() {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [filteredParcelas, setFilteredParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todas");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/parcelas/eliminadas")
      .then((res) => {
        const data = res.data;
        setParcelas(data);
        setFilteredParcelas(data);
      })
      .catch(() => {
        setParcelas([]);
        setFilteredParcelas([]);
      })
      .finally(() => setTimeout(() => setLoading(false), 800));
  }, []);

  const applyFilter = (tipo: string) => {
    setFilter(tipo);
    const now = new Date();

    const filtered = parcelas.filter((p) => {
      const fecha = new Date(p.fechaEliminada);
      const diffMs = now.getTime() - fecha.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (tipo === "hoy") return fecha.toDateString() === now.toDateString();
      if (tipo === "semana") return diffDays <= 7;
      if (tipo === "mes") return diffDays <= 30;
      return true; // Todas
    });

    setFilteredParcelas(filtered);
  };

  const goToUser = () => {
    navigate("/usuario");
  };

  return (
    <div className="d-flex dashboard-container">
      <Sidebar />
      <div className="flex-grow-1 p-3">
        <header className="dashboard-topbar mb-4">
          <div className="d-flex align-items-center">
            <div className="me-2 leaf-icon">🌱</div>
            <h1 className="text-white mb-0">Parcelas Eliminadas</h1>
          </div>
          <button className="user-badge" onClick={goToUser} title="Ir al perfil">
            MV
          </button>
        </header>

        <div className="dashboard-layout">
          <div className="deleted-table">
            <div className="title-and-filters">
              <h2 className="table-title">Historial de las parcelas que fueron eliminadas</h2>
              <div className="filter-buttons">
                <button onClick={() => applyFilter("hoy")} className={filter === "hoy" ? "active" : ""}>
                  Hoy
                </button>
                <button onClick={() => applyFilter("semana")} className={filter === "semana" ? "active" : ""}>
                  Última semana
                </button>
                <button onClick={() => applyFilter("mes")} className={filter === "mes" ? "active" : ""}>
                  Último mes
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Ubicación</th>
                  <th>Tipo Cultivo</th>
                  <th>Responsable</th>
                  <th>Último riego</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredParcelas.length > 0 &&
                  filteredParcelas.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>{p.ubicacion}</td>
                      <td>{p.tipo_cultivo}</td>
                      <td>{p.responsable}</td>
                      <td>{new Date(p.ultimo_riego).toLocaleString("es-ES")}</td>
                      <td>
                        <button className="restore-button">Restaurar parcela</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="spinner-container">
              {loading && <div className="spinner pink"></div>}
              {loading && <p className="spinner-text">Buscando parcelas...</p>}
              {!loading && filteredParcelas.length === 0 && (
                <div className="no-results">⚠️ No se encontraron parcelas eliminadas.</div>
              )}
            </div>
          </div>
        </div>

        <div className="last-updated-container">
          <span className="last-updated-text">
            Última actualización: {new Date().toLocaleString("es-ES")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DeletedParcelas;
