import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../Styles/Usuario.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPalette,
  FaFutbol,
  FaMapMarkerAlt,
  FaTint,
  FaTemperatureHigh,
  FaRunning,
  FaLock,
} from "react-icons/fa";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  // Example usage of handleLogout
  <button onClick={handleLogout} className="logout-button">
    Logout
  </button>

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="profile-container" style={{ flex: 1 }}>
        {/* Header */}
        <div className="profile-header-style">
          <h1>
            <span className="profile-icon">👤</span>
            Perfil
          </h1>
          <button className="user-badge" onClick={() => navigate("/usuario")}>
            MV
          </button>
        </div>

        {/* Contenido centrado */}
        <div className="profile-content">
          <div className="profile-info">
            <h2>Información del Perfil</h2>
            <div className="info-item">
              <span className="label"><FaUser /> Nombre completo:</span>
              <span className="value">Juan Pérez</span>
            </div>
            <div className="info-item">
              <span className="label"><FaEnvelope /> Correo electrónico:</span>
              <span className="value">juan.perez@example.com</span>
            </div>
            <div className="info-item">
              <span className="label"><FaPhone /> Teléfono:</span>
              <span className="value">555-1234567</span>
            </div>
            <div className="info-item">
              <span className="label"><FaLock /> Contraseña:</span>
              <span className="value">•••••••••••</span>
            </div>
            <div className="info-item">
              <span className="label"><FaPalette /> Color favorito:</span>
              <span className="value">Rosa</span>
            </div>
            <div className="info-item">
              <span className="label"><FaFutbol /> Deporte favorito:</span>
              <span className="value">Fútbol</span>
            </div>
          </div>

          <div className="sensor-info">
            <h2>Información del Sensor</h2>
            <div className="info-item">
              <span className="label"><FaMapMarkerAlt /> Ubicación:</span>
              <span className="value">Sala de estar</span>
            </div>
            <div className="info-item">
              <span className="label"><FaTint /> Humedad:</span>
              <span className="value">78%</span>
            </div>
            <div className="info-item">
              <span className="label"><FaTemperatureHigh /> Temperatura:</span>
              <span className="value">23°C</span>
            </div>
            <div className="info-item">
              <span className="label"><FaRunning /> Movimiento:</span>
              <span className="value">Detectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
