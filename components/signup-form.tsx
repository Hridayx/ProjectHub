'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ApiError } from '@/lib/api-error';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string): string => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };

    if (!requirements.length) {
      return 'Password must be at least 8 characters long';
    }
    if (!requirements.uppercase || !requirements.lowercase) {
      return 'Password must contain both uppercase and lowercase letters';
    }
    if (!requirements.number) {
      return 'Password must contain at least one number';
    }
    if (!requirements.special) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return '';
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@mahindrauniversity.edu.in')) {
      newErrors.email = 'Only @mahindrauniversity.edu.in email addresses are allowed';
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];
      if (firstError) {
        setError(firstError);
      }
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message before redirecting
        setError('');
        window.location.assign('/login?registered=true');
      } else if (data.error?.code === 'auth/user-exists') {
        setError('A user with this email already exists');
      } else {
        setError(data.error?.message || 'Registration failed');
      }
    } catch (error) {
      // Use more specific error message from the server if available
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-gray-500">Enter your details to create your account</p>
      </div>

      {error && (
        <div 
          role="alert" 
          className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            aria-label="username"
            aria-required="true"
            aria-invalid={!!error && !formData.username}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.name@mahindrauniversity.edu.in"
            pattern="[a-z0-9._%+-]+@mahindrauniversity\.edu\.in$"
            title="Please use your Mahindra University email address"
            required
            aria-label="email"
            aria-required="true"
            aria-invalid={!!error && (!formData.email || !formData.email.endsWith('@mahindrauniversity.edu.in'))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            aria-label="password"
            aria-required="true"
            aria-invalid={!!error && !!validatePassword(formData.password)}
            minLength={8}
            title="Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            aria-label="confirm password"
            aria-required="true"
            aria-invalid={!!error && formData.password !== formData.confirmPassword}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#6b3e7c] hover:bg-[#5a2e6b] transition-colors"
          data-testid="signup-submit"
          disabled={loading}
          aria-disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="animate-pulse mr-2">⋯</span>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#6b3e7c] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
