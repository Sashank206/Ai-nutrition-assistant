import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure Axios defaults or handle custom calls
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await axios.get("http://localhost:5000/api/users/profile", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setUser(res.data);
        } catch (error) {
          console.error("Failed to load user profile:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    const { token, user: userData } = response.data;
    localStorage.setItem("token", token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, onboardingData = {}) => {
    const response = await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password,
      ...onboardingData,
    });
    const { token, user: userData } = response.data;
    localStorage.setItem("token", token);
    
    // Check if onboardingData needs to be explicitly synced
    if (Object.keys(onboardingData).length > 0) {
      try {
        const updateRes = await axios.put(
          "http://localhost:5000/api/users/profile",
          onboardingData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(updateRes.data.user);
      } catch (err) {
        console.error("Failed to sync onboarding details:", err);
        setUser(userData);
      }
    } else {
      setUser(userData);
    }
    return token;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const reloadUser = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error reloading user:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
