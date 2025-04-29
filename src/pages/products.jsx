import React, { useEffect, useState } from "react";
import { addToCart, fetchCart } from "../services/cartService";
import { getProducts, deleteProduct, updateProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/userService";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchCartCount();
    const loadUser = async () => {
          try {
            const user = await getUser();
            console.log(user.user);
            if (user?.user.role === 'admin') {
              setIsAdmin(true);
            }
          } catch (error) {
            console.error("Failed to fetch user profile:", error);
          }
        };

     loadUser();   
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchCartCount = async () => {
    try {
      const data = await fetchCart();
      const totalItems = data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(totalItems);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      await fetchCartCount();
      alert("Item added to cart!");
    } catch (error) {
      alert("Failed to add item to cart");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteProduct(id);
        await fetchProducts();
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  const handleEdit = (product) => {
    console.log('product',product);
    setEditProductId(product._id);
    setEditFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editFormData.name);
    formData.append("price", Number(editFormData.price));  
    formData.append("category", editFormData.category);
    formData.append("stock", Number(editFormData.stock));  
    if (editFormData.image) {
      formData.append("image", editFormData.image);
    }
  
    try {
      await updateProduct(editProductId, formData);
      setEditProductId(null);
      await fetchProducts();
    } catch (error) {
      alert("Failed to update product");
    }
  };
  

  const goToCart = () => {
    navigate("/cart");
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
        <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
        {localStorage.getItem('token') && (
    <div className="relative">
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
        {cartCount}
      </span>
      <button className="text-gray-800 focus:outline-none" onClick={goToCart}>
        🛒 Cart
      </button>
    </div>
    )}
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded shadow hover:shadow-md transition"
            >
              {editProductId === product._id ? (
                <form onSubmit={handleUpdateSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditInputChange}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Category"
                  />
                  <input
                    type="number"
                    name="stock"
                    value={editFormData.stock}
                    onChange={handleEditInputChange}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Stock"
                  />
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                    Save
                  </button>
                </form>
              ) : (
                <>
                  <img
                    src={`https://ecommerce-backend-wm9g.onrender.com${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-green-500 font-semibold">Price: ${product.price}</p>
                  <p className="text-green-400 font-semibold">Category: {product.category}</p>
                  <p className="text-black-400 font-semibold">Stock: {product.stock}</p>
                  <div className="flex gap-2 mt-2">
                  {isAdmin && (
                <div className="flex gap-2 mt-2">
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => handleEdit(product)}
                >
                    Update
                </button>
                <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(product._id)}
                >
                    Delete
                </button>
                </div>
                )}
                  </div>
                  <button
                    className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition w-full"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
