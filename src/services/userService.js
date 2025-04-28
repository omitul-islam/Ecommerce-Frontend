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

  export const getUsersByAdmin = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    try {
      const response = await api.get('/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      throw error;
    }
  };

  export const updateUser = async (id, updatedData) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    try {
      const response = await api.put(`admin/users/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
      throw error;
    }
  };
  
  export const deleteUser = async (id) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    try {
      const response = await api.delete(`admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      throw error;
    }
  };