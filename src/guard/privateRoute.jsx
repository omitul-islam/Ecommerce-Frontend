import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../services/userService";

const PrivateRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const user = await getUser(); 
          if (user?.user.role === "admin") {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!token || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
