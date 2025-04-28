import api from './axios';

export const createOrder = async (orderDetails) => {
    // console.log("ORDERDATA",orderData)
    // const orderDaTa = {
    //     products: ["680cd74a3cfc04970575f3dc", "680cd7c23cfc04970575f3e0"],  
    //     totalAmount: 56453593.52,
    //     address: "User's Address Here",
    //   };
  const token = localStorage.getItem('token');
  console.log("ORDERDATA",orderDetails)
  
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  try {
    const response = await api.post(
      '/v1/order', 
      orderDetails, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw error;
  }
};

export const getOrders = async (isAdmin) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found. Please log in again.");
  }

  try {
    if (isAdmin === true) {
    //console.log("Yes admin")  
      const response = await api.get('/admin/order', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    //console.log("ekhanei ",response.data.Orders)
      return response.data;
    } else {
      const response = await api.get('/v1/order', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw error;
  }
};

export const updateOrder = async (orderId, updatedDetails) => {
    const token = localStorage.getItem('token');
    console.log(updatedDetails)
  
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
  
    try {
      const response = await api.patch(
        `/admin/order/${orderId}`,
        updatedDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error.response?.data || error.message);
      throw error;
    }
  };
  
  export const deleteOrder = async (orderId) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
  
    try {
      const response = await api.delete(`/admin/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error.response?.data || error.message);
      throw error;
    }
  };