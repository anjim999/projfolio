// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use sessionStorage so each browser tab/window has an isolated session
    const stored = sessionStorage.getItem("auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.token) {
          setAuth(parsed);
        } else {
          sessionStorage.removeItem("auth");
        }
      } catch (e) {
        console.error("Failed to parse auth from sessionStorage", e);
        sessionStorage.removeItem("auth");
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    // Validate the payload to avoid accidental overwrites (e.g. using non-auth responses)
    if (!data || !data.token || !data.user) {
      console.warn('Auth.login called with invalid payload, ignoring', data);
      return;
    }

    const payload = {
      token: data.token,
      user: data.user,
    };

    setAuth(payload);
    sessionStorage.setItem("auth", JSON.stringify(payload)); 
  };

  const logout = () => {
    setAuth(null);
    sessionStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}