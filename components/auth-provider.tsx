import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialState?: {
    user: User | null;
    loading?: boolean;
  };
}

export function AuthProvider({ children, initialState }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: initialState?.user ?? null,
    loading: initialState?.loading ?? true,
    error: null,
  });

  const router = useRouter();

  const clearError = () => setAuthState((prevState) => ({ ...prevState, error: null }));

  const login = async (email: string, password: string) => {
    clearError();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
        router.refresh();
        return { success: true };
      }

      setAuthState((prevState) => ({
        ...prevState,
        error: data.error?.message || 'Login failed',
      }));
      return { success: false, error: data.error };
    } catch (error) {
      const message = 'An error occurred during login';
      setAuthState((prevState) => ({
        ...prevState,
        error: message,
      }));
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
      router.refresh();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setAuthState((prevState) => ({
        ...prevState,
        error: 'Logout failed. Please try again.',
      }));
    }
  };

  const register = async (userData: { username: string; email: string; password: string }) => {
    clearError();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?registered=true');
        return { success: true };
      }

      setAuthState((prevState) => ({
        ...prevState,
        error: data.error?.message || 'Registration failed',
      }));
      return { success: false, error: data.error };
    } catch (error) {
      const message = 'An error occurred during registration';
      setAuthState((prevState) => ({
        ...prevState,
        error: message,
      }));
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        if (response.ok) {
          setAuthState({
            user: data.user,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: data.error?.message || 'Authentication failed',
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: 'Failed to check authentication status',
        });
      }
    };

    checkAuth();
  }, []);

  if (authState.loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
