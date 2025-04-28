import api from "./axios";

export const addToCart = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(`/cart/item/${productId}`, {}, {  
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    throw error;
  }
};

export const fetchCart = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get("/cart/item", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    throw error;
  }
};

export const updateCart = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(
        `/cart/item/${productId}`,
        { quantity },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; 
    } catch (error) {
      console.error("Error updating cart:", error.message);
      throw error;
    }
  };

  export const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(
        `/cart/item`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; 
    } catch (error) {
      console.error("Error deleting cart:", error.message);
      throw error;
    }
  };
  