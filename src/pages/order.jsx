import React, { useState, useEffect } from "react";
import { getOrders } from "../services/orderService";  

const OrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await getOrders();
        setOrders(ordersData.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    loadOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
                <p className="text-gray-600">Total Amount: ${(order.totalAmount).toFixed(2)}</p>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Address: {order.address}</p>
              </div>
              <div className="flex flex-col space-y-2">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img
                      src={`http://localhost:3000${product.image}`}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <p className="text-gray-600">{product.name}</p>
                    <p className="text-gray-600">Quantity: {product.quantity}</p>
                    <p className="text-green-500 font-semibold">
                      Price: ${(product.price || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
