import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, mockLocation } from '../utils';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/login-form';
import { AuthProvider } from '@/components/auth-provider';

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = 'http://localhost:3000/';
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

    await user.type(emailInput, 'test@invalid.com');
    await user.type(passwordInput, 'Test@123Password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /only @mahindrauniversity\.edu\.in/i
      );
    }, { timeout: 2000 });
  });
  it('should log in successfully with valid credentials', async () => {
    const user = userEvent.setup();
    await render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByTestId('login-submit');

    await user.type(emailInput, 'test.user@mahindrauniversity.edu.in');
    await user.type(passwordInput, 'Test@123Password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(window.location.href).toContain('/dashboard');
    }, { timeout: 2000 });
  });
  it('should show error for invalid credentials', async () => {
    const user = userEvent.setup();
    await render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByTestId('login-submit');

    await user.type(emailInput, 'test.user@mahindrauniversity.edu.in');
    await user.type(passwordInput, 'WrongPassword123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /invalid email or password/i
      );
    }, { timeout: 2000 });
  });
});
