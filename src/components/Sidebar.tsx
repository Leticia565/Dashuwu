"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import "../styles/Sidebar.css"
import {
  FaTachometerAlt,
  FaHistory,
  FaTrashAlt,
  FaWater,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaLeaf,
} from "react-icons/fa"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem("auth")
    navigate("/", { replace: true })
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button
        className="toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <span className="toggle-arrow">{isOpen ? "‹" : "›"}</span>
      </button>

      <div className="sidebar-content">
        <div className="logo">
          <div className="logo-container">
            <div className="logo-circle"></div>
            <div className="logo-leaf"><FaLeaf className="animated-icon" /></div>
          </div>
          {isOpen && <div className="logo-text">Cultivitos</div>}
        </div>

        <ul className="nav-links">
          <li className={isActive("/dashboard") ? "active" : ""} onClick={() => navigate("/dashboard")}>
            <FaTachometerAlt className="animated-icon" />
            {isOpen && <span className="nav-text">Dashboard</span>}
          </li>

          <li className={isActive("/historial") ? "active" : ""} onClick={() => navigate("/historial")}>
            <FaHistory className="animated-icon" />
            {isOpen && <span className="nav-text">Historial</span>}
          </li>

          <li className={isActive("/eliminadas") ? "active" : ""} onClick={() => navigate("/eliminadas")}>
            <FaTrashAlt className="animated-icon" />
            {isOpen && <span className="nav-text">Eliminados</span>}
          </li>

          <li className={isActive("/zonasriego") ? "active" : ""} onClick={() => navigate("/zonasriego")}>
            <FaWater className="animated-icon" />
            {isOpen && <span className="nav-text">Riego</span>}
          </li>

          <li className={isActive("/zonasinactivas") ? "active" : ""} onClick={() => navigate("/zonasinactivas")}>
            <FaExclamationTriangle className="animated-icon" />
            {isOpen && <span className="nav-text">Inactivas</span>}
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="animated-icon" />
          {isOpen && <span>Cerrar sesión</span>}
        </button>
        {isOpen && (
          <footer className="footer-text">
            <small>© 2025 | Cupul Dzul | Todos los derechos reservados.</small>
          </footer>
        )}
      </div>
    </div>
  )
}

export default Sidebar
