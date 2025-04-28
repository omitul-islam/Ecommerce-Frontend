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

export const getOrders = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }

  try {
    const response = await api.get('/v1/order', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.response?.data || error.message);
    throw error;
  }
};
