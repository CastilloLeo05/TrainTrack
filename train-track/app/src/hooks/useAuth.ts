'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';

type StoredUser = {
  id?: number;
  email?: string;
  fullname?: string;
  username?: string;
};

export function useAuth() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
      const rawToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

      if (rawUser) setUser(JSON.parse(rawUser));
      if (rawToken) setToken(rawToken);
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user && !!token;
  const displayName =
    user?.fullname || user?.username || user?.email || 'runner';

  return { user, token, loading, isAuthenticated, displayName, logout };
}
