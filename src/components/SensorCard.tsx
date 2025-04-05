import React from "react";
import "../styles/SensorCard.css";

interface SensorCardProps {
  label: string;
  value: string;
  trend?: "up" | "down" | "stable";
  icon: React.ReactNode;
}

const SensorCard: React.FC<SensorCardProps> = ({ label, value, trend, icon }) => {
  return (
    <div className="sensor-card">
      <div className="sensor-icon">{icon}</div>
      <div className="sensor-label">{label}</div>
      <div className="sensor-value">{value}</div>
      {trend && <div className="sensor-trend">Tendencia: {trend}</div>}
    </div>
  );
};

export default SensorCard;
