import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthError {
  code: string;
  message: string;
  status: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          const data = await response.json();
          setAuthState({ user: data.user, loading: false, error: null });
        } else {
          const errorData = await response.json();
          setAuthState({ user: null, loading: false, error: errorData.error });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          loading: false,
          error: {
            code: 'auth/network-error',
            message: 'Failed to check authentication status',
            status: 500,
          },
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
        router.push('/dashboard');
        return { success: true as const };
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: data.error,
        });
        return { success: false as const, error: data.error };
      }
    } catch (error) {
      const networkError = {
        code: 'auth/network-error',
        message: 'Failed to login. Please check your internet connection.',
        status: 500,
      };
      setAuthState({
        user: null,
        loading: false,
        error: networkError,
      });
      return { success: false as const, error: networkError };
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
        router.push('/login');
        return { success: true as const };
      } else {
        const data = await response.json();
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: data.error,
        }));
        return { success: false as const, error: data.error };
      }
    } catch (error) {
      const networkError = {
        code: 'auth/network-error',
        message: 'Failed to logout. Please check your internet connection.',
        status: 500,
      };
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: networkError,
      }));
      return { success: false as const, error: networkError };
    }
  };

  const register = async (userData: RegisterCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?registered=true');
        return { success: true as const };
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: data.error,
        });
        return { success: false as const, error: data.error };
      }
    } catch (error) {
      const networkError = {
        code: 'auth/network-error',
        message: 'Failed to register. Please check your internet connection.',
        status: 500,
      };
      setAuthState({
        user: null,
        loading: false,
        error: networkError,
      });
      return { success: false as const, error: networkError };
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    register,
  };
}
