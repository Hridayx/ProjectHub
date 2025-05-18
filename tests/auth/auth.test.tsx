import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, mockLocation } from '../utils';
import { LoginForm } from '@/components/login-form';
import { SignupForm } from '@/components/signup-form';
import userEvent from '@testing-library/user-event';

describe('Authentication System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.href = 'http://localhost:3000/';
  });

  describe('LoginForm', () => {
    test('shows validation error for invalid email domain', async () => {
      const user = userEvent.setup();
      await render(<LoginForm />);

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

    test('shows error for invalid credentials', async () => {
      const user = userEvent.setup();
      await render(<LoginForm />);

      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByTestId('login-submit');

      await user.type(emailInput, 'wrong@mahindrauniversity.edu.in');
      await user.type(passwordInput, 'WrongPass123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          /invalid email or password/i
        );
      }, { timeout: 2000 });
    });

    test('handles successful login', async () => {
      const user = userEvent.setup();
      await render(<LoginForm />);

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
  });

  describe('SignupForm', () => {
    test('validates password requirements', async () => {
      const user = userEvent.setup();
      await render(<SignupForm />);

      const usernameInput = screen.getByRole('textbox', { name: /username/i });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText('confirm password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@mahindrauniversity.edu.in');
      await user.type(passwordInput, 'weak');
      await user.type(confirmPasswordInput, 'weak');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          /password must be at least 8 characters/i
        );
      }, { timeout: 2000 });
    });

    test('shows error for existing email', async () => {
      const user = userEvent.setup();
      await render(<SignupForm />);

      const usernameInput = screen.getByRole('textbox', { name: /username/i });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText('confirm password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test.user@mahindrauniversity.edu.in');
      await user.type(passwordInput, 'ValidPass123!');
      await user.type(confirmPasswordInput, 'ValidPass123!');
      await user.click(submitButton);        await waitFor(() => {
          expect(screen.getByRole('alert')).toHaveTextContent(
            /a user with this email already exists/i
          );
        }, { timeout: 2000 });
    });

    test('handles successful registration', async () => {
      const user = userEvent.setup();
      await render(<SignupForm />);

      const usernameInput = screen.getByRole('textbox', { name: /username/i });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText('confirm password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      await user.type(usernameInput, 'newuser');
      await user.type(emailInput, 'new.user@mahindrauniversity.edu.in');
      await user.type(passwordInput, 'NewPass123!');
      await user.type(confirmPasswordInput, 'NewPass123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLocation.href).toContain('/login?registered=true');
      }, { timeout: 2000 });
    });
  });
});
