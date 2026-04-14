import { useState } from "react";
import { Form, Button, Row, Col, Image, Spinner, Table, Alert } from "react-bootstrap";

const ProductForm = ({ productoInicial = {}, onProductAdded, onCancelar }) => {
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    categoria: "",
    variantes: [],
    ...productoInicial,
  });

  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  // Agregar variante
  const agregarVariante = () => {
    setProducto((prev) => ({
      ...prev,
      variantes: [...prev.variantes, { color: "", imagenes: [], tallesUnidades: [] }],
    }));
  };

  const cambiarColorVariante = (index, valor) => {
    const copia = [...producto.variantes];
    copia[index].color = valor;
    setProducto({ ...producto, variantes: copia });
  };

  // Subir múltiples imágenes a Cloudinary
  const subirImagenVariante = async (index, e) => {
    const archivos = Array.from(e.target.files);
    if (archivos.length === 0) return;

    setCargando(true);

    try {
      const urls = await Promise.all(
        archivos.map(async (archivo) => {
          const formData = new FormData();
          formData.append("file", archivo);
          formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

          const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`;
          const res = await fetch(url, { method: "POST", body: formData });
          const data = await res.json();

          if (data.secure_url) {
            return data.secure_url;
          } else {
            throw new Error("Error al subir imagen");
          }
        })
      );

      const copia = [...producto.variantes];
      copia[index].imagenes.push(...urls);
      setProducto({ ...producto, variantes: copia });
    } catch (err) {
      console.error("Error al subir imagen:", err);
      alert("No se pudo subir la imagen.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarImagenVariante = (indexVariante, indexImagen) => {
    const copia = [...producto.variantes];
    copia[indexVariante].imagenes = copia[indexVariante].imagenes.filter((_, i) => i !== indexImagen);
    setProducto({ ...producto, variantes: copia });
  };

  const agregarFilaTalleVariante = (index) => {
    const copia = [...producto.variantes];
    copia[index].tallesUnidades.push({ talle: "", stock: 0 });
    setProducto({ ...producto, variantes: copia });
  };

  const cambiarFilaTalleVariante = (indexVariante, indexTalle, campo, valor) => {
    const copia = [...producto.variantes];
    copia[indexVariante].tallesUnidades[indexTalle][campo] =
      campo === "stock" ? Number(valor) || 0 : valor;
    setProducto({ ...producto, variantes: copia });
  };

  const eliminarFilaTalleVariante = (indexVariante, indexTalle) => {
    const copia = [...producto.variantes];
    copia[indexVariante].tallesUnidades = copia[indexVariante].tallesUnidades.filter((_, i) => i !== indexTalle);
    setProducto({ ...producto, variantes: copia });
  };

  const handleGuardar = async () => {
    if (!producto.nombre || !producto.precio || !producto.categoria) {
      alert("Campos obligatorios: nombre, precio y categoría");
      return;
    }

    const nuevoProducto = {
      name: producto.nombre,
      price: Number(parseFloat(producto.precio).toFixed(2)), // 👈 aseguramos número
      description: producto.descripcion,
      category: producto.categoria,
      imageUrl: producto.variantes[0]?.imagenes[0] || "",
      colors: producto.variantes.map((v) => ({
        name: v.color,
        imageUrl: v.imagenes[0] || "",
        imagenes: v.imagenes,
        sizes: v.tallesUnidades.map((t) => ({
          size: t.talle,
          stock: t.stock,
        })),
      })),
      createdAt: new Date().toISOString(),
    };

    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar producto");
      }

      const data = await res.json();
      onProductAdded(data);

      setMensajeExito("✅ Producto creado correctamente");

      setProducto({
        nombre: "",
        precio: "",
        descripcion: "",
        categoria: "",
        variantes: [],
      });
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el producto: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Form className="container-fluid">
      {mensajeExito && (
        <Alert variant="success" onClose={() => setMensajeExito("")} dismissible>
          {mensajeExito}
        </Alert>
      )}

      {/* Campos principales */}
      <Row>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombre"
              value={producto.nombre}
              onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio (ARS)</Form.Label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <Form.Control
                name="precio"
                type="number"
                value={producto.precio}
                onChange={(e) => setProducto({ ...producto, precio: Number(e.target.value) || 0 })}
                placeholder="Ej: 120000"
                min={0}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={producto.categoria}
              onChange={(e) => setProducto({ ...producto, categoria: e.target.value })}
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="calzados">Calzados</option>
              <option value="indumentaria">Indumentaria</option>
              <option value="accesorios">Accesorios</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="descripcion"
              value={producto.descripcion}
              onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Variantes */}
      <Form.Group className="mb-3">
        <Form.Label>Variantes por color</Form.Label>
        {producto.variantes.map((v, i) => (
          <div key={i} className="mb-3 border p-2 rounded">
            <Row>
              <Col xs={12} md={4}>
                <Form.Control
                  type="text"
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => cambiarColorVariante(i, e.target.value)}
                  className="mb-2"
                />
              </Col>
              <Col xs={12} md={8}>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => subirImagenVariante(i, e)}
                  className="mb-2"
                />
                {cargando && <Spinner animation="border" size="sm" className="ms-2" />}
                <div className="d-flex flex-wrap">
                  {v.imagenes.map((img, j) => (
                    <div key={j} className="me-2 mb-2 position-relative">
                      <Image src={img} thumbnail width={80} height={80} />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="position-absolute top-0 end-0"
                        onClick={() => eliminarImagenVariante(i, j)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </Col>
               </Row>

            <Table bordered size="sm" responsive>
              <thead>
                <tr>
                  <th>Talle</th>
                  <th>Unidades</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {v.tallesUnidades.map((tu, k) => (
                  <tr key={k}>
                    <td>
                      <Form.Control
                        value={tu.talle}
                        onChange={(e) =>
                          cambiarFilaTalleVariante(i, k, "talle", e.target.value)
                        }
                        placeholder="Ej: S, M, L"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={tu.stock}
                        onChange={(e) =>
                          cambiarFilaTalleVariante(i, k, "stock", e.target.value)
                        }
                        min={0}
                      />
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminarFilaTalleVariante(i, k)}
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
                      onClick={() => agregarFilaTalleVariante(i)}
                    >
                      + Agregar talle
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        ))}
        <Button variant="outline-primary" size="sm" onClick={agregarVariante}>
          + Agregar variante
        </Button>
      </Form.Group>

      <div className="mt-3 d-flex justify-content-end flex-wrap">
        {onCancelar && (
          <Button variant="secondary" onClick={onCancelar} className="me-2 mb-2">
            Cancelar
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleGuardar}
          disabled={cargando}
          className="mb-2"
        >
          {cargando ? <Spinner size="sm" /> : "Guardar"}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;