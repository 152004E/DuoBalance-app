import { LoginPayload, RegisterPayload } from "@/types/api";
import { api } from "./client";

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const refreshToken = async (refreshToken: string) => {
  const { data } = await api.post("/auth/refresh", {
    refreshToken,
  });

  return data;
};

export const logout = async (refreshToken: string) => {
  const { data } = await api.post("/auth/logout", {
    refreshToken,
  });

  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};