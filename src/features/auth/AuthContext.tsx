import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from './authApi';
import { AuthState, LoginCredentials, SignupCredentials, User } from './types';

const TOKEN_STORAGE_KEY = '@clock_app_auth_token_v1';
const USER_STORAGE_KEY = '@clock_app_auth_user_v1';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from AsyncStorage on app launch
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_STORAGE_KEY),
          AsyncStorage.getItem(USER_STORAGE_KEY),
        ]);

        if (storedToken && storedUser && isMounted) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);

          // Silently verify token with backend in background
          authApi.getProfile(storedToken).then((freshUser) => {
            if (isMounted && freshUser) {
              setUser(freshUser);
              AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
            }
          }).catch((err) => {
            console.warn('Session expired or token invalid:', err.message);
            // In case token is revoked or invalid:
            if (err.message.includes('401') || err.message.includes('expired')) {
              setToken(null);
              setUser(null);
              AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
            }
          });
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    setToken(data.token);
    await Promise.all([
      AsyncStorage.setItem(TOKEN_STORAGE_KEY, data.token),
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user)),
    ]);
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    const data = await authApi.signup(credentials);
    setUser(data.user);
    setToken(data.token);
    await Promise.all([
      AsyncStorage.setItem(TOKEN_STORAGE_KEY, data.token),
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user)),
    ]);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
