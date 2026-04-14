import { Link } from "react-router-dom";

export default function Navbar({ isAdmin, onLogout, products }) {
  const categorias = ["calzados", "indumentaria", "accesorios"];

  // Mostrar solo categorías con productos cargados
  const categoriasDisponibles = categorias.filter(cat =>
    Array.isArray(products) &&
    products.some(p => p.category && p.category.toLowerCase() === cat)
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Tienda Mia</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {categoriasDisponibles.map(cat => (
              <li key={cat} className="nav-item">
                <a className="nav-link" href={`#${cat}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </a>
              </li>
            ))}

            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={onLogout}>
                    Salir
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}