import api from "./axios";

export const getUser = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    try {
      const response = await api.get('/user/profile', {
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