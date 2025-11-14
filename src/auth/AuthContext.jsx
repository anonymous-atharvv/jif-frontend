import React, { createContext, useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jif_token");
    const email = localStorage.getItem("jif_email");
    if (token) setUser({ email });
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/judge/login", { email, password });
    if (res.data && res.data.token) {
      localStorage.setItem("jif_token", res.data.token);
      localStorage.setItem("jif_email", email);
      setUser({ email });
      return { ok: true };
    }
    return { ok: false, error: res.data || "Login failed" };
  };

  const logout = () => {
    localStorage.removeItem("jif_token");
    localStorage.removeItem("jif_email");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
