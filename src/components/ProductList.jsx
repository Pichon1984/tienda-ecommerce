import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => {
        console.log("Productos cargados:", data); // 👀 Verificar que llega createdAt
        setProducts(data);
      })
      .catch(err => console.error("❌ Error cargando productos:", err));
  }, []);

  if (products.length === 0) return <p>No hay productos disponibles.</p>;

  const categorias = ["calzados", "indumentaria", "accesorios"];

  // ✅ Formatear precios en pesos argentinos
  const formatPrice = (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);

  // ✅ Función para saber si es nuevo (7 días)
  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Nuestros Productos</h2>

      {categorias.map(cat => {
        const productosCat = products.filter(
          p => p.category && p.category.toLowerCase() === cat
        );
        if (productosCat.length === 0) return null;

        return (
          <section key={cat} id={cat} className="mb-5">
            <h3 className="mb-4 text-capitalize">{cat}</h3>
            <div className="row">
              {productosCat.map(product => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      {/* ✅ Badge de nuevo */}
                      {isNewProduct(product.createdAt) && (
                        <span className="badge bg-success mb-2">Nuevo</span>
                      )}

                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>

                      {/* ✅ Mostrar precio normal u oferta */}
                      {product.onSale ? (
                        <div>
                          <span className="text-muted text-decoration-line-through me-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <span className="fw-bold text-danger">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <p className="fw-bold text-success">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}

                      <Link
                        to={`/product/${product._id}`}
                        className="btn btn-primary mt-2"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}