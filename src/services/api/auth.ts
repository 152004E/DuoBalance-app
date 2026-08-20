import {
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  UserResponse,
} from '@/types/api';
import { api } from './client';
import { appendSourceToFormData } from './upload';

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

export const verifyEmail = async (token: string) => {
  const { data } = await api.post('/auth/verify-email', { token });
  return data as UserResponse;
};

export const resendVerification = async (email: string) => {
  const { data } = await api.post('/auth/resend-verification', { email });
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await api.post('/auth/reset-password', payload);
  return data;
};

export const refreshToken = async (refreshToken: string) => {
  const { data } = await api.post('/auth/refresh', {
    refreshToken,
  });

  return data;
};

export const logout = async (refreshToken: string) => {
  const { data } = await api.post('/auth/logout', {
    refreshToken,
  });

  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await api.patch('/auth/profile', payload);
  return data as UserResponse;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await api.patch('/auth/password', payload);
  return data;
};

export const uploadAvatar = async (
  source: { uri: string; name?: string; type?: string } | File,
) => {
  const isFile = typeof File !== 'undefined' && source instanceof File;

  const formData = new FormData();

  if (isFile) {
    formData.append('file', source as File, (source as File).name);
  } else {
    await appendSourceToFormData(
      formData,
      'file',
      source as { uri: string; name?: string; type?: string },
      'avatar.jpg',
    );
  }

  const { data } = await api.post('/auth/profile/avatar', formData);
  return data as UserResponse;
};
