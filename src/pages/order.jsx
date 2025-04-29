import React, { useState, useEffect } from "react";
import { getOrders, updateOrder, deleteOrder } from "../services/orderService";
import { getUser } from "../services/userService";  
import Swal from 'sweetalert2';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading,setLoading] = useState(false);
  
  useEffect(() => {
   

    const loadUser = async () => {
      try {
        const user = await getUser();
        if (user?.user.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    const loadOrders = async () => {
        try {
          const user = await getUser();
          const ordersData = await getOrders(user?.user.role === 'admin');
          setOrders(ordersData.orders || []);
          console.log(">>>>>>>>>",ordersData.orders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      };
    loadUser();
    loadOrders();
  }, []);

  const handleUpdateOrder = async (orderId) => {
    const updatedDetails = {
      status: "confirmed",
    };

    try {
      setLoading(true);
      const updatedOrder = await updateOrder(orderId, updatedDetails);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "confirmed" } : order
        )
      );
      
      Swal.fire({
        title: 'Success!',
        text: 'Order has been Confirmed.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
     

    } catch (error) {
      console.error("Error updating order:", error.message);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await deleteOrder(orderId);
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        Swal.fire({
          title: 'Deleted!',
          text: 'Your order has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error("Error deleting order:", error.message);
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } finally {
        setLoading(false);
      }
    }
  };

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
                <h3 className="text-lg font-bold">Order ID: {order._id}</h3>
                <p className="text-gray-600 font-semibold">Username: {(order.user.username)}</p>
                <p className="text-gray-600">Total Amount: ${(order.totalAmount).toFixed(2)}</p>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Address: {order.address}</p>
              </div>
              <div className="flex flex-col space-y-2">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img
                    src={`https://ecommerce-backend-wm9g.onrender.com${product.productId.image}`}
                    alt={product.name}
                    className="w-18 h-18 object-cover rounded mb-4"
                    />
                      <div className="flex flex-col space-y-1">
                      <p className="text-gray-600">Product: {product.productId.name}</p>
                      <p className="text-gray-600">Quantity: {product.quantity}</p>
                      <p className="text-green-500 font-semibold">
                      Price: ${(product.price || 0).toFixed(2)}
                      </p>
                      </div>
                  </div>
                ))}
              </div>
              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateOrder(order._id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
