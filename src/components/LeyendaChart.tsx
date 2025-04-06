// components/LeyendaChart.tsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import "../styles/LeyendaChart.css";

ChartJS.register(ArcElement, Tooltip);

const LeyendaChart: React.FC = () => {
  const data = {
    labels: ["Aspersión", "Goteo", "Superficie", "Otro"],
    datasets: [
      {
        data: [10, 15, 7, 3],
        backgroundColor: ["#4fc3f7", "#81c784", "#ffb74d", "#ba68c8"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const leyenda = [
    { label: "Aspersión", color: "#4fc3f7" },
    { label: "Goteo", color: "#81c784" },
    { label: "Superficie", color: "#ffb74d" },
    { label: "Otro", color: "#ba68c8" },
  ];

  return (
    <div className="leyenda-solo-chart">
      <h4 className="titulo-chart">Distribución por Tipo de Riego</h4>
      <Doughnut data={data} options={{ plugins: { legend: { display: false } } }} />

      <div className="leyenda-rectangular">
        {leyenda.map((item) => (
          <div className="leyenda-item" key={item.label}>
            <span className="leyenda-color" style={{ backgroundColor: item.color }}></span>
            <span className="leyenda-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeyendaChart;
