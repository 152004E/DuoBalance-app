import { LoginPayload, RegisterPayload, UpdateProfilePayload, UserResponse } from "@/types/api";
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

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await api.patch("/auth/profile", payload);
  return data as UserResponse;
};

export const uploadAvatar = async (
  source: { uri: string; name?: string; type?: string } | File,
) => {
  const isFile = typeof File !== "undefined" && source instanceof File;

  const formData = new FormData();

  if (isFile) {
    formData.append("file", source as File, (source as File).name);
  } else {
    const s = source as { uri: string; name?: string; type?: string };
    const filename = s.name ?? s.uri.split("/").pop() ?? "avatar.jpg";
    const ext = filename.split(".").pop() ?? "jpg";
    formData.append("file", {
      uri: s.uri,
      name: filename,
      type: s.type ?? `image/${ext}`,
    } as any);
  }

  const { data } = await api.post("/auth/profile/avatar", formData);
  return data as UserResponse;
};