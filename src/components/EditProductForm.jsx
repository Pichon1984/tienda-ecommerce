import { useState } from "react";
import { Form, Button, Row, Col, Image, Table } from "react-bootstrap";

export default function EditProductForm({ product, onProductUpdated, onClose }) {
  const [formData, setFormData] = useState({
    name: product.name,
    originalPrice: product.originalPrice || product.price, // precio base
    price: product.price, // rebajado si está en oferta
    category: product.category,
    imageUrl: product.imageUrl,
    onSale: product.onSale || false,
    colors: product.colors || [],
  });
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "originalPrice"
          ? Number(value) || 0
          : value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

    const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`;
    const res = await fetch(url, { method: "POST", body: data });
    const result = await res.json();
    if (!result.secure_url) throw new Error("Error al subir imagen");
    return result.secure_url;
  };

  const cambiarColor = (index, valor) => {
    const copia = [...formData.colors];
    copia[index].name = valor;
    setFormData({ ...formData, colors: copia });
  };

  const agregarVariante = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", imagenes: [], sizes: [] }],
    }));
  };

  const eliminarVariante = (index) => {
    const copia = [...formData.colors];
    copia.splice(index, 1);
    setFormData({ ...formData, colors: copia });
  };

  const agregarTalle = (index) => {
    const copia = [...formData.colors];
    copia[index].sizes.push({ size: "", stock: 0 });
    setFormData({ ...formData, colors: copia });
  };

  const cambiarTalle = (indexVariante, indexTalle, campo, valor) => {
    const copia = [...formData.colors];
    copia[indexVariante].sizes[indexTalle][campo] =
      campo === "stock" ? Number(valor) || 0 : valor;
    setFormData({ ...formData, colors: copia });
  };

  const eliminarTalle = (indexVariante, indexTalle) => {
    const copia = [...formData.colors];
    copia[indexVariante].sizes.splice(indexTalle, 1);
    setFormData({ ...formData, colors: copia });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;
      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        originalPrice: Number(formData.originalPrice), // siempre se guarda
        price: formData.onSale ? Number(formData.price) : Number(formData.originalPrice), // si no hay oferta, igual al original
        onSale: formData.onSale,
        imageUrl,
        colors: formData.colors,
      };

      const res = await fetch(`http://localhost:5000/api/productos/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al editar producto");
      }

      const updated = await res.json();
      onProductUpdated(updated);
      onClose();
    } catch (err) {
      console.error("❌ Error editando producto:", err);
      alert("No se pudo editar el producto: " + err.message);
    }
  };

   return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar producto</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Precio original */}
              <div className="mb-3">
                <label className="form-label">Precio original (ARS)</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="form-control"
                    min="0"
                  />
                </div>
              </div>

              {/* Oferta */}
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  name="onSale"
                  checked={formData.onSale}
                  onChange={handleChange}
                  className="form-check-input"
                  id="onSaleCheck"
                />
                <label className="form-check-label" htmlFor="onSaleCheck">
                  Producto en oferta
                </label>
              </div>

              {formData.onSale && (
                <div className="mb-3">
                  <label className="form-label">Precio rebajado (ARS)</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="form-control"
                      min="0"
                    />
                  </div>
                </div>
              )}

              {/* Imagen principal */}
              <div className="mb-3">
                <label className="form-label">Imagen principal</label>
                <img
                  src={formData.imageUrl}
                  alt={formData.name}
                  className="img-fluid mb-2"
                  style={{ maxHeight: "100px", objectFit: "contain" }}
                />
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="form-control mb-2"
                  placeholder="URL de Cloudinary"
                />
                <input type="file" onChange={handleFileChange} className="form-control" />
              </div>

              {/* Variantes */}
              <h6>Variantes por color</h6>
              {formData.colors.map((color, i) => (
                <div key={i} className="border p-2 mb-3 rounded">
                  <Row>
                    <Col md={4}>
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => cambiarColor(i, e.target.value)}
                        className="form-control mb-2"
                        placeholder="Color"
                      />
                    </Col>
                    <Col md={8}>
                      <div className="d-flex flex-wrap">
                        {color.imagenes.map((img, j) => (
                          <Image
                            key={j}
                            src={img}
                            thumbnail
                            width={80}
                            height={80}
                            className="me-2 mb-2"
                          />
                        ))}
                      </div>
                    </Col>
                  </Row>

                  <Table bordered size="sm" responsive>
                    <thead>
                      <tr>
                        <th>Talle</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {color.sizes.map((s, k) => (
                        <tr key={k}>
                          <td>
                            <input
                              type="text"
                              value={s.size}
                              onChange={(e) => cambiarTalle(i, k, "size", e.target.value)}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={s.stock}
                              onChange={(e) => cambiarTalle(i, k, "stock", e.target.value)}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => eliminarTalle(i, k)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => agregarTalle(i)}
                          >
                            + Agregar talle
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => eliminarVariante(i)}
                  >
                    Eliminar variante
                  </Button>
                </div>
              ))}
              <Button variant="outline-primary" size="sm" onClick={agregarVariante}>
                + Agregar variante
              </Button>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Guardar cambios</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}