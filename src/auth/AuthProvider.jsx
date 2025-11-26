import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../api/laravelAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved user from storage (offline login)
  useEffect(() => {
    const loadData = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);

    setUser(res.user);
    setToken(res.token);

    await AsyncStorage.setItem("user", JSON.stringify(res.user));
    await AsyncStorage.setItem("token", res.token);
  };

  const signup = async (name, email, password) => {
    const res = await registerUser(name, email, password);

    setUser(res.user);
    setToken(res.token);

    await AsyncStorage.setItem("user", JSON.stringify(res.user));
    await AsyncStorage.setItem("token", res.token);
  };


  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
