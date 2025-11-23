import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Initialize token immediately
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  
  // Initialize loading based on token presence
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  // --- FIXED LOGIN FUNCTION ---
  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    
    // 1. START LOADING: This prevents the Protected Route from redirecting immediately
    setLoading(true); 
    
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/me", {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.log("Failed to fetch user after login:", err);
      logout();
    } finally {
      // 2. STOP LOADING: Only render the dashboard once user data is ready
      setLoading(false); 
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  // --- INITIAL CHECK ---
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/api/v1/user/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};