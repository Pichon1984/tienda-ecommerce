import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Respuesta login:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        onLogin(true);
        navigate("/dashboard");
      } else {
        alert(data.error || "Error en login");
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Acceso Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Ingrese su email"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={!email || !password}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}