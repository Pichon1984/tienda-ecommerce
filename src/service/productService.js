import api from "./api";

// Crear producto
export async function createProduct(productData) {
  try {
    const res = await api.post("/productos", productData);
    return res.data;
  } catch (err) {
    console.error("❌ Error al crear producto:", err);
    throw err;
  }
}

// Obtener todos los productos
export async function getProducts() {
  try {
    const res = await api.get("/productos");
    return res.data;
  } catch (err) {
    console.error("❌ Error al obtener productos:", err);
    throw err;
  }
}

// Obtener producto por ID
export async function getProductById(id) {
  try {
    const res = await api.get(`/productos/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error al obtener producto:", err);
    throw err;
  }
}

// Editar producto
export async function updateProduct(id, productData) {
  try {
    const res = await api.put(`/productos/${id}`, productData);
    return res.data;
  } catch (err) {
    console.error("❌ Error al editar producto:", err);
    throw err;
  }
}

// Eliminar producto
export async function deleteProduct(id) {
  try {
    const res = await api.delete(`/productos/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error al eliminar producto:", err);
    throw err;
  }
}

// Actualizar stock de una variante (color + talle)
export async function updateVariantStock(id, colorName, size, stock) {
  try {
    const res = await api.patch(`/productos/${id}/variant-stock`, {
      colorName,
      size,
      stock,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error al actualizar stock:", err);
    throw err;
  }
}

// Agregar imagen a un color
export async function addImage(id, colorName, imageUrl) {
  try {
    const res = await api.patch(`/productos/${id}/add-image`, {
      colorName,
      imageUrl,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error al agregar imagen:", err);
    throw err;
  }
}

// Eliminar imagen de un color
export async function removeImage(id, colorName, imageUrl) {
  try {
    const res = await api.patch(`/productos/${id}/remove-image`, {
      colorName,
      imageUrl,
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error al eliminar imagen:", err);
    throw err;
  }
}
