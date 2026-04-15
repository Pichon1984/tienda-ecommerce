import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import EditProductForm from "../components/EditProductForm";

export default function Dashboard({ products, setProducts }) {
  const token = localStorage.getItem("token");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/productos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Respuesta productos:", data);
        setProducts(data.products);
      })
      .catch(err => console.error("❌ Error cargando productos:", err));
  }, [token, setProducts]);

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error("❌ Error eliminando producto:", err);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Panel de administración</h2>

      {/* Sección subir producto */}
      <div className="mb-5">
        <h3 className="mb-3">Subir producto</h3>
        <ProductForm onProductAdded={handleProductAdded} />
      </div>

      {/* Sección productos existentes */}
      <div>
        <h3 className="mb-3">Productos existentes</h3>
        {products.length === 0 ? (
          <p className="text-muted">No hay productos cargados.</p>
        ) : (
          <div className="row row-cols-2 row-cols-md-3 g-2">
            {products.map(p => (
              <div key={p._id} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body p-1 text-center">
                    <strong className="small d-block">{p.name}</strong>
                    <span className="badge bg-success mb-1">${p.price}</span>
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="img-fluid mb-1"
                        style={{ maxHeight: "50px", objectFit: "contain" }}
                      />
                    )}

                    <div className="d-flex justify-content-center gap-2 mt-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setEditingProduct(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onProductUpdated={(updated) => {
            setProducts(products.map(p => (p._id === updated._id ? updated : p)));
            setEditingProduct(null);
          }}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}