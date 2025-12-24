import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, mockLocation, cleanup } from '../utils';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/login-form';
import { AuthProvider } from '@/components/auth-provider';
import { act } from '@testing-library/react';

describe('Authentication Flow', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset location between tests
    await act(async () => {
      mockLocation.href = 'http://localhost:3000';
      mockLocation.pathname = '/';
    });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('should show error for invalid email domain', async () => {
    const user = userEvent.setup();
    await render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByTestId('login-submit');

    await act(async () => {
      await user.type(emailInput, 'test@invalid.com');
      await user.type(passwordInput, 'Test@123Password');
    });

    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /only @mahindrauniversity\.edu\.in/i
      );
    });
  });

  it('should log in successfully with valid credentials', async () => {
    const user = userEvent.setup();
    
    // Mock fetch for this test only
    const mockFetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );
    global.fetch = mockFetch;

    await render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByTestId('login-submit');

    await act(async () => {
      await user.type(emailInput, 'test.user@mahindrauniversity.edu.in');
      await user.type(passwordInput, 'Test@123Password');
    });

    await act(async () => {
      await user.click(submitButton);
    });

    // Wait for the fetch request to be made exactly once
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Then wait for navigation to complete
    await waitFor(() => {
      expect(mockLocation.pathname).toBe('/dashboard');
    });
  });

  it('should show error for invalid credentials', async () => {
    const user = userEvent.setup();
    
    // Mock fetch for this test only
    const mockFetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: { message: 'Invalid email or password' } })
      })
    );
    global.fetch = mockFetch;

    await render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByTestId('login-submit');

    await act(async () => {
      await user.type(emailInput, 'test.user@mahindrauniversity.edu.in');
      await user.type(passwordInput, 'WrongPassword123!');
    });

    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /invalid email or password/i
      );
    });
  });
});
