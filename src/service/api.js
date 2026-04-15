import axios from "axios";
// Loguear la URL base que está usando
console.log("🔍 API URL en este build:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de request: adjunta token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ejemplo: JWT guardado en localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Error en la petición:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);


async function addImage(productId, colorName, imageUrl) {
  try {
    const res = await api.patch(`/productos/${productId}/add-image`, {
      colorName,
      imageUrl,
    });
    console.log("✅ Imagen agregada:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error al agregar imagen:", err);
  }
}


async function removeImage(productId, colorName, imageUrl) {
  try {
    const res = await api.patch(`/productos/${productId}/remove-image`, {
      colorName,
      imageUrl,
    });
    console.log("✅ Imagen eliminada:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error al eliminar imagen:", err);
  }
}

export default api;
