import { STORAGE_KEYS } from '@/constants/config';

export interface AuthState {
  username: string | null;
}

export const authStorage = {
  get: (): AuthState => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { username: null };
      }
    }
    return { username: null };
  },
  
  set: (username: string): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ username }));
  },
  
  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },
};

