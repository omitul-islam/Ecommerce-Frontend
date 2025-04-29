import React, { useState, useEffect } from "react";
import { clearCart, fetchCart, updateCart } from "../services/cartService"; 
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [address, setAddress] = useState(""); 

  useEffect(() => {
    const loadCart = async () => {
      const cartData = await fetchCart();
      setCart(cartData?.cart.items || []);
    };
    loadCart();
  }, []);

  const handleUpdateCart = async (productId, quantity) => {
    try {
      const response = await updateCart(productId, quantity);
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

  const handlePlaceOrder = async () => {
    try {
      const orderDetails = {
        products: cart
          .filter(item => item.product && item.product._id)
          .map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.price
          })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        address: address, 
      };
  
      if (orderDetails.products.length === 0) {
        throw new Error("No valid products in the cart.");
      }
  
      const response = await createOrder(orderDetails);
  
      if (response) {
        console.log("Order placed successfully:", response);
        Swal.fire({
          title: 'Success!',
          text: 'Your order has been placed successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate("/order-confirmation");
        });
      } else {
        console.error("Order creation failed: ", response?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error creating order:", error.message || error);
    }
  };

  
  const handleClearCart = async () => {
    try {
      await clearCart(); 
      setCart([]);
      Swal.fire({
        title: 'Success!',
        text: 'Your cart has been cleared.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error deleting cart:", error.message);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
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

            if (!item.product) {
              return null;
            }

            return (
              <div
                key={productId || `fallback-key-${index}`} 
                className="p-4 border rounded shadow flex justify-between items-center"
              >
                <div>
                  {item.product.image && (
                    <img
                      src={`https://ecommerce-backend-wm9g.onrender.com${product.productId.image}`}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
                  <p className="text-gray-600">Name: {item.product.name}</p>
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
      {cart.length > 0 && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}  
            className="px-4 py-2 border rounded w-full"
          />
         <div className="flex flex-col gap-y-3 w-1/8">
         <button
            onClick={handlePlaceOrder}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Place Order
          </button>
          <button
            onClick={handleClearCart}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
         </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
