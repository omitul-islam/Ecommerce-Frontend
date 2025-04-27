import React, { useState } from "react";
import { createProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";

const ProductManager = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: selectedFile,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("price", formData.price);
    productData.append("category", formData.category);
    productData.append("stock", formData.stock);
    if (formData.image) {
      console.log(formData.image)  
      productData.append("image", formData.image);
      console.log(productData)
    }

    try {
    //   console.log(">>>>>>>>>>>>>>>>>",productData)  
      await createProduct(productData);
      setSuccessMessage("Product created successfully!");
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        image: null,
      });
      navigate("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Product Management</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-md bg-white space-y-4"
      >
        <div>
          <label className="block text-gray-600 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter product price"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter product category"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter product stock"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-2">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductManager;
