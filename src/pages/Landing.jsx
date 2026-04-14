import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../service/api";

export default function Landing({ isAdmin, handleLogout }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/productos", {
          params: { search: searchTerm, page, limit: 12 }
        });
        setProducts(res.data.products); // ✅ siempre un array
        setTotalPages(res.data.pages);
      } catch (err) {
        console.error("❌ Error cargando productos:", err);
      }
    };
    fetchProducts();
  }, [searchTerm, page]);

  const categorias = ["calzados", "indumentaria", "accesorios"];

  const formatPrice = (value) => {
    if (typeof value !== "number" || isNaN(value)) return "";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <>
   
      <div className="container my-5" id="top">
        <h2 className="mb-4 text-center">Bienvenido a la tienda</h2>

        {/* ✅ Buscador */}
        <div className="mb-4 text-center">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // resetear a la primera página al buscar
            }}
            style={{ maxWidth: "400px", margin: "0 auto" }}
          />
        </div>

        {products.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          categorias.map(cat => {
            const productosCat = products.filter(
              p => p.category && p.category.toLowerCase() === cat
            );
            if (productosCat.length === 0) return null;

            return (
              <section key={cat} id={cat} className="mb-5">
                <h3 className="mb-4 text-capitalize">{cat}</h3>
                <div className="row">
                  {productosCat.map(p => (
                    <div key={p._id} className="col-6 col-lg-2 mb-4">
                      <Link
                        to={`/product/${p._id}`}
                        className="text-decoration-none text-dark"
                      >
                        <div className="card h-100 shadow-sm">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="card-img-top"
                            style={{ height: "120px", objectFit: "cover" }}
                          />
                          <div className="card-body p-2 text-center">
                            {isNewProduct(p.createdAt) && (
                              <span className="badge bg-success mb-2">Nuevo</span>
                            )}
                            <h6 className="card-title">{p.name}</h6>
                            {p.onSale ? (
                              <div>
                                <span className="text-muted text-decoration-line-through me-2">
                                  {formatPrice(p.originalPrice || p.price)}
                                </span>
                                <span className="fw-bold text-danger">
                                  {formatPrice(p.price)}
                                </span>
                              </div>
                            ) : (
                              <p className="fw-bold text-success">
                                {formatPrice(p.originalPrice || p.price)}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}

        {/* ✅ Paginación */}
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}