"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import "../styles/Sidebar.css"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile and adjust sidebar accordingly
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsOpen(false)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
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
            <div className="logo-leaf"></div>
          </div>
          {isOpen && <div className="logo-text">Cultivitos</div>}
        </div>

        <ul className="nav-links">
          <li className={isActive("/dashboard") ? "active" : ""} onClick={() => navigate("/dashboard")}>
            <span className="nav-icon dashboard-icon"></span>
            {isOpen && <span className="nav-text">Dashboard</span>}
          </li>
          <li className={isActive("/historial") ? "active" : ""} onClick={() => navigate("/historial")}>
            <span className="nav-icon history-icon"></span>
            {isOpen && <span className="nav-text">Historial</span>}
          </li>
          <li className={isActive("/eliminadas") ? "active" : ""} onClick={() => navigate("/eliminadas")}>
            <span className="nav-icon trash-icon"></span>
            {isOpen && <span className="nav-text">Eliminados</span>}
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <span className="logout-icon"></span>
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

