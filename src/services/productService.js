import api from './axios';

export const getProducts = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/products',{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
export const createProduct = async (productData) => {
    console.log(productData);  
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
  
    try {
      const response = await api.post(
        '/products',
        productData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error.response?.data || error.message);
      throw error; 
    }
  };

  export const updateProduct = async (id, productData) => {
    const token = localStorage.getItem('token');
    console.log("updatedData",productData)
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    try {
      const response = await api.put(`/products/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      throw error;
    }
  };

  export const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    try {
      const response = await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      throw error;
    }
  };
