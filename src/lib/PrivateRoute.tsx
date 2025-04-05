import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

function PrivateRoute({ children }: Props) {
  const isAuth = localStorage.getItem("auth") === "true";
  const isVerified = localStorage.getItem("verified") === "true";
  const location = useLocation();

  if (!isAuth) return <Navigate to="/" replace />;
  if (!isVerified && location.pathname !== "/verificar") {
    return <Navigate to="/verificar" replace />;
  }

  return children;
}

export default PrivateRoute;
