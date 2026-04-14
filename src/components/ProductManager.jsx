import { useEffect, useState } from "react";
import { getProducts, addImage, removeImage } from "../service/productService";

export default function ProductManager() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  const handleAddImage = async (id) => {
    await addImage(id, "azul", "https://res.cloudinary.com/.../nueva.jpg");
    const data = await getProducts(); // refrescar lista
    setProducts(data);
  };

  const handleRemoveImage = async (id) => {
    await removeImage(id, "azul", "https://res.cloudinary.com/.../vieja.jpg");
    const data = await getProducts(); // refrescar lista
    setProducts(data);
  };

  return (
    <div className="container">
      <h2>Gestión de productos</h2>
      {products.map((p) => (
        <div key={p._id} className="card mb-3 p-3 shadow-sm">
          <h3>{p.name}</h3>
          <p>💲 Precio: {p.price}</p>
          <p>📝 {p.description}</p>

          {/* Imagen principal */}
          {p.imageUrl && (
            <img
              src={p.imageUrl}
              alt={p.name}
              style={{ width: "200px", objectFit: "contain" }}
            />
          )}

          {/* Colores */}
          <div className="mt-3">
            <h4>Colores disponibles:</h4>
            {p.colors.map((c, idx) => (
              <div key={idx} className="mb-2">
                <strong>{c.name}</strong>
                <div className="d-flex gap-2 mt-1">
                  {/* Imagen principal del color */}
                  {c.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  )}
                  {/* Todas las imágenes adicionales */}
                  {c.imagenes?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${c.name}-${i}`}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  ))}
                </div>
                {/* Botones de prueba */}
                <button onClick={() => handleAddImage(p._id)}>➕ Agregar imagen</button>
                <button onClick={() => handleRemoveImage(p._id)}>🗑️ Eliminar imagen</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
