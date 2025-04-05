import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Styles/RegisterForm.css";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const nombre = (form[0] as HTMLInputElement).value;
    const correo = (form[1] as HTMLInputElement).value;
    const password = (form[2] as HTMLInputElement).value;
    const color_favorito = (form[3] as HTMLInputElement).value;
    const deporte_favorito = (form[4] as HTMLInputElement).value;

    // Acción puramente de frontend: mostramos los datos en consola
    console.log("Datos de registro:", { nombre, correo, password, color_favorito, deporte_favorito });

    // Redirigimos a la pantalla de login (o a donde prefieras)
    navigate("/login");
  };

  return (
    <div className="register-elegant">
      <div className="form-wrapper">
        <h2> Crear cuenta</h2>
        <p className="subtitle">Proporciona la información requerida</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre completo:" required />
          <input type="email" placeholder="Correo electrónico:" required />
          <input type="password" placeholder="Contraseña:" required />
          <input type="text" placeholder="Color favorito:" required />
          <input type="text" placeholder="Deporte favorito:" required />
          <button type="submit">Registrarse</button>
        </form>
        <p className="register-link">
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
