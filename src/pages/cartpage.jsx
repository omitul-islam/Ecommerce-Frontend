import React, { useState, useEffect } from "react";
import { fetchCart, updateCart } from "../services/cartService";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      const cartData = await fetchCart();
      setCart(cartData?.cart.items || []);
    };
    loadCart();
  }, []);

  const handleUpdateCart = async (productId, quantity) => {
    console.log("Updating Cart with ProductId:", productId, "Quantity:", quantity);
    try {
      const response = await updateCart(productId, quantity);
      console.log("Updated Cart Response:", response);
      setCart(response.cart.items);
    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };

  const handleIncrease = (productId, quantity) => {
    if (!productId) {
      return;
    }
    handleUpdateCart(productId, quantity + 1);
  };

  const handleDecrease = (productId, quantity) => {
    if (!productId) {
      return;
    }
    if (quantity > 1) {
      handleUpdateCart(productId, quantity - 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => {
            const productId =
              typeof item.product === "object" ? item.product?._id : item.product;

            if (!productId) {
              return null;
            }

            console.log("Rendering item with Product ID:", productId);
            return (
              <div
                key={productId || `fallback-key-${index}`} 
                className="p-4 border rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-green-500 font-semibold">
                    Price: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDecrease(productId, item.quantity)}
                    className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleIncrease(productId, item.quantity)}
                    className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CartPage;