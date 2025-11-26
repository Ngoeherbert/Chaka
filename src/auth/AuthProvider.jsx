import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "@users";
const AUTH_KEY = "@authUser";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(USERS_KEY);
        setUsers(storedUsers ? JSON.parse(storedUsers) : []);
        const authUser = await AsyncStorage.getItem(AUTH_KEY);
        setUser(authUser ? JSON.parse(authUser) : null);
      } catch (e) {
        console.error("AuthProvider init error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) throw new Error("Invalid email or password");
    setUser(found);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(found));
  };

  const signup = async ({ name, email, password }) => {
    if (users.find((u) => u.email === email))
      throw new Error("Email already exists");
    const newUser = { id: users.length + 1, name, email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return { ...context, loading: !!context.loading, user: context.user ?? null };
};
