const AUTH_KEY = 'pokemon_app_auth';

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

export const authStorage = {
  get: (): AuthState => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isAuthenticated: false, username: null };
      }
    }
    return { isAuthenticated: false, username: null };
  },
  
  set: (username: string): void => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      isAuthenticated: true,
      username,
    }));
  },
  
  clear: (): void => {
    localStorage.removeItem(AUTH_KEY);
  },
};

