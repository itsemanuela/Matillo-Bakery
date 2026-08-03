import { Navigate } from "react-router-dom";

function RequiredAdmin({ children }) {
  const salvato = localStorage.getItem("utente");
  const utente = salvato ? JSON.parse(salvato) : null;

  if (!utente || utente.ruolo !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequiredAdmin;
