import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import HistoricalCharts from "./components/HistoricalCharts";
import DeletedParcelas from "./components/DeletedParcelas";
import ZonasInactivas from "./components/ZonasInactivas";
import ZonasRiego from "./components/ZonasRiego";

import Login from "./pages/Login";
import Verificar from "./pages/Verificar";
import Usuario from "./pages/Usuario";
import RegisterForm from "./pages/RegisterForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/verificar" element={<Verificar />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/historial" element={<HistoricalCharts />} />
        <Route path="/eliminadas" element={<DeletedParcelas />} />
        <Route path="/zonasinactivas" element={<ZonasInactivas />} />
        <Route path="/zonasriego" element={<ZonasRiego />} />
      </Routes>
    </Router>
  );
}

export default App;
