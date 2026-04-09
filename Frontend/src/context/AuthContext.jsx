import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    const token = localStorage.getItem("mentor_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.me();
      setUser(response.data.data.user);
      setProfile(response.data.data.profile);
    } catch (error) {
      localStorage.removeItem("mentor_token");
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const login = async (payload) => {
    const response = await authService.login(payload);
    localStorage.setItem("mentor_token", response.data.data.token);
    setUser(response.data.data.user);
    await loadCurrentUser();
    toast.success("Welcome back");
    return response.data.data.user;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    localStorage.setItem("mentor_token", response.data.data.token);
    setUser(response.data.data.user);
    await loadCurrentUser();
    toast.success("Account created");
    return response.data.data.user;
  };

  const logout = () => {
    localStorage.removeItem("mentor_token");
    setUser(null);
    setProfile(null);
    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      setProfile,
      setUser,
      login,
      register,
      logout,
      refresh: loadCurrentUser,
    }),
    [user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
