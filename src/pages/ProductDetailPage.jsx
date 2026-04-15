import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../service/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // 👉 Número de WhatsApp desde .env (Vite)
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/productos/${id}`);
        setProduct(res.data);

        if (res.data.colors.length > 0) {
          setSelectedColor(res.data.colors[0]);
          setSelectedImage(res.data.colors[0].imageUrl);
        }
      } catch (err) {
        console.error("❌ Error cargando producto:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Cargando producto...</p>;

  // ✅ Función para saber si es nuevo (7 días)
  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  // ✅ Formatear precios en pesos argentinos con protección
  const formatPrice = (value) => {
    if (typeof value !== "number" || isNaN(value)) return "";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola! Quiero consultar por el producto:
- Nombre: ${product.name}
- Precio: ${product.onSale ? formatPrice(product.price) : formatPrice(product.originalPrice || product.price)}
- Color: ${selectedColor?.name || ""}
- Talle: ${selectedSize?.size || ""}
- Stock disponible: ${selectedSize?.stock || ""}`
  )}`;

  return (
    <div className="container my-5">
      <div className="row">
        {/* Galería */}
        <div className="col-12 col-md-6 mb-4">
          {selectedImage && (
            <img
              src={selectedImage}
              alt={product.name}
              className="img-fluid mb-3 border"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          )}
          <div className="d-flex gap-2 flex-wrap">
            {selectedColor?.imageUrl && (
              <img
                src={selectedColor.imageUrl}
                alt={selectedColor.name}
                style={{ width: "60px", height: "60px", cursor: "pointer", objectFit: "cover" }}
                onClick={() => setSelectedImage(selectedColor.imageUrl)}
              />
            )}
            {selectedColor?.imagenes?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${selectedColor.name}-${i}`}
                style={{ width: "60px", height: "60px", cursor: "pointer", objectFit: "cover" }}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="col-12 col-md-6">
          <h2>
            {product.name}{" "}
            {isNewProduct(product.createdAt) && (
              <span className="badge bg-success ms-2">Nuevo</span>
            )}
          </h2>

          {/* ✅ Precio con lógica de oferta */}
          {product.onSale ? (
            <div className="mb-3">
              <h4>
                <span className="text-muted text-decoration-line-through me-2">
                  {formatPrice(product.originalPrice || product.price)}
                </span>
                <span className="fw-bold text-danger">
                  {formatPrice(product.price)}
                </span>
              </h4>
            </div>
          ) : (
            <h4 className="text-success">
              {formatPrice(product.originalPrice || product.price)}
            </h4>
          )}

          {/* ✅ Descripción con saltos de línea */}
          <div className="mb-3">
            {product.description.split(".").map((parte, i) =>
              parte.trim() ? <p key={i}>{parte.trim()}</p> : null
            )}
          </div>

          {/* Colores */}
          <h5>Colores</h5>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {product.colors.map((c, idx) => (
              <button
                key={idx}
                className={`btn btn-sm ${
                  selectedColor?.name === c.name ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => {
                  setSelectedColor(c);
                  setSelectedImage(c.imageUrl);
                  setSelectedSize(null);
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Talles con stock */}
          <h5>Talles</h5>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {selectedColor?.sizes?.map((s, i) => (
              <button
                key={i}
                className={`btn btn-sm ${
                  selectedSize?.size === s.size ? "btn-success" : "btn-outline-success"
                }`}
                disabled={s.stock === 0}
                onClick={() => setSelectedSize(s)}
              >
                {s.size} ({s.stock} disponibles)
              </button>
            ))}
          </div>

          {/* Confirmación */}
          {selectedColor && selectedSize && (
            <p>
              Elegiste color <strong>{selectedColor.name}</strong>, talle <strong>{selectedSize.size}</strong>.  
              Stock disponible: <strong>{selectedSize.stock}</strong>
            </p>
          )}

          {/* WhatsApp */}
          <a
            href={selectedColor && selectedSize ? whatsappUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-success btn-lg mt-3 ${
              !(selectedColor && selectedSize) ? "disabled" : ""
            }`}
          >
            📲 Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}