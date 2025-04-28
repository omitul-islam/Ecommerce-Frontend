import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import RegistrationPage from "./pages/registration";
import ProductList from "./pages/products";
import LoginPage from "./pages/login";
import CartPage from "./pages/cartpage";
import ProductManager from "./pages/productAdd";
import OrderPage from "./pages/order";

function App() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">ECOMMERCE</h1>
        <div className="flex space-x-4">
        
          {token && (
            <Link to="/add-product">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Add Product
              </button>
            </Link>
          )}

          {!token ? (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/add-product" element={<ProductManager />} />
        <Route path="/order-confirmation" element={<OrderPage />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;