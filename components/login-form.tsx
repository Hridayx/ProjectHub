// Component: Replicates user authentication login form
'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';
import { Github } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmailDomain = (email: string) => {
    return email.endsWith('@mahindrauniversity.edu.in');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (!validateEmailDomain(email)) {
      setError('Only @mahindrauniversity.edu.in email addresses are allowed');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        await router.push('/dashboard');
      } else {
        setError(data.error?.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-gray-500">Enter your email and password to access your account</p>
      </div>

      {error && (
        <div 
          role="alert" 
          id="login-error" 
          className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            pattern="[a-z0-9._%+-]+@mahindrauniversity\.edu\.in$"
            autoComplete="email"
            aria-label="Email"
            aria-required="true"

            aria-invalid={!!error}
            aria-describedby={error ? 'login-error' : undefined}
            placeholder="your.name@mahindrauniversity.edu.in"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-label="Password"
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'login-error' : undefined}
            placeholder="Enter your password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            name="remember"
            aria-label="Remember me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label 
            htmlFor="remember" 
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#6b3e7c] hover:bg-[#5a2e6b]"
          disabled={loading}
          aria-disabled={loading}
          name="email-login"
          data-testid="login-submit"
          aria-label="Email sign in"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        type="button"
        name="github-login"
        data-testid="github-login"
        aria-label="Sign in with GitHub"
      >
        <Github className="mr-2 h-4 w-4" /> GitHub
      </Button>

      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link 
          href="/signup" 
          className="text-[#6b3e7c] hover:underline"
          aria-label="Sign up for an account"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
