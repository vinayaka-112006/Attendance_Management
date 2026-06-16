import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("attendease_user") || "null"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("attendease_token");
    if (!token) return;
    api.get("/auth/me").then((res) => {
      setUser(res.data.user);
      localStorage.setItem("attendease_user", JSON.stringify(res.data.user));
    }).catch(() => logout());
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("attendease_token", res.data.token);
      localStorage.setItem("attendease_user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("attendease_token");
    localStorage.removeItem("attendease_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
