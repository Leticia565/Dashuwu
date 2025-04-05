import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const correo = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;

    console.log("Inicio de sesión con:", { correo, password });

    localStorage.setItem("auth", "true");
    navigate("/verificar", { replace: true });
  };

  return (
    <div className="login-elegant">
      <div className="form-wrapper">
        <h2>Inicia sesión</h2>
        <p className="subtitle">
          Para ingresar a tu cuenta proporciona tus credenciales.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-icon-group">
            <input type="email" placeholder="Correo electrónico:" required />
          </div>

          <div className="input-icon-group">
            <input type="password" placeholder="Contraseña:" required />
          </div>

          <button type="submit">Entrar</button>
        </form>

        <p className="register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
