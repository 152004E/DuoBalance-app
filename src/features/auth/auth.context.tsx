import { createContext, useEffect, useState, ReactNode } from 'react';

import {
  tokenStorage,
  refreshTokenStorage,
  userStorage,
} from '@/storage/token';
import { eventEmitter } from '@/utils/event-emitter';
import { getJwtExp } from '@/utils/jwt';
import { getProfile } from '@/services/api/auth';

import type { UserResponse } from '@/types/api';

type User = UserResponse;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  signIn: (
    user: User,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  async function signIn(
    userData: User,
    accessToken: string,
    refreshToken: string,
  ) {
    await tokenStorage.set(accessToken);
    await refreshTokenStorage.set(refreshToken);
    await userStorage.set(userData);

    setUser(userData);
  }

  async function signOut() {
    await tokenStorage.remove();
    await refreshTokenStorage.remove();
    await userStorage.remove();

    setUser(null);
  }

  async function updateUser(userData: User) {
    await userStorage.set(userData);
    setUser(userData);
  }

  async function restoreSession() {
    try {
      const token = await tokenStorage.get();
      const savedUser = await userStorage.get();

      if (token && savedUser) {
        const exp = getJwtExp(token);

        if (exp !== null && exp * 1000 <= Date.now()) {
          await tokenStorage.remove();
          await refreshTokenStorage.remove();
          await userStorage.remove();
          return;
        }

        setUser(savedUser as User);

        getProfile()
          .then((profile) => {
            setUser(profile);
            userStorage.set(profile);
          })
          .catch(() => {});
      } else {
        await tokenStorage.remove();
        await refreshTokenStorage.remove();
        await userStorage.remove();
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = eventEmitter.on('session:expired', () => {
      signOut();
    });

    restoreSession();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
