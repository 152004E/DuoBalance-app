// src/features/auth/context/auth.context.tsx

import { createContext, useEffect, useState, ReactNode } from 'react';

import { tokenStorage, userStorage } from '@/storage/token';

import type { UserResponse } from '@/types/api';

type User = UserResponse;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  signIn: (user: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  async function signIn(userData: User, token: string) {
    await tokenStorage.set(token);
    await userStorage.set(userData);

    setUser(userData);
  }

  async function signOut() {
    await tokenStorage.remove();
    await userStorage.remove();

    setUser(null);
  }

  async function restoreSession() {
    try {
      const token = await tokenStorage.get();
      const savedUser = await userStorage.get();

      if (token && savedUser) {
        setUser(savedUser);
        return;
      }

      await tokenStorage.remove();
      await userStorage.remove();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
