import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductList from "./components/ProductList";
import ProductDetailPage from "./pages/ProductDetailPage";
import Footer from "./components/Footer";
import api from "./service/api";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("token"));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/productos")
      .then(res => {
        // ✅ aseguramos que sea un array
        setProducts(Array.isArray(res.data.products) ? res.data.products : []);
      })
      .catch(err => console.error("❌ Error cargando productos:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
  };

  return (
    <Router>
      {/* ✅ Navbar global, aparece una sola vez */}
      <Navbar isAdmin={isAdmin} onLogout={handleLogout} products={products} />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Landing products={products} isAdmin={isAdmin} handleLogout={handleLogout} />}
          />
          <Route path="/login" element={<Login onLogin={setIsAdmin} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard products={products} setProducts={setProducts} />
              </ProtectedRoute>
            }
          />
          <Route path="/products" element={<ProductList products={products} />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;