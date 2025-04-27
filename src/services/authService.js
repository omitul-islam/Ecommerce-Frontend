import api from "./axios";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Login failed" };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post("/auth/register", { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Registration failed" };
  }
};