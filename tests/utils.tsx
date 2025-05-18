import { render as testingLibraryRender, cleanup } from '@testing-library/react';
import { AuthProvider } from '@/components/auth-provider';
import type { ReactNode } from 'react';
import { expect, vi } from 'vitest';
import type { User } from '@/types/auth';
import { ThemeProvider } from '@/components/theme-provider';
import { act } from '@testing-library/react';

export * from '@testing-library/react';

// Mock window.location
const mockLocation = {
  href: '',
  pathname: '',
  search: '',
  hash: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn()
};

// Add custom matchers for testing error messages
declare global {
  namespace Vi {
    interface JestAssertion {
      toHaveErrorMessage(message: string): void;
    }
  }
}

expect.extend({
  toHaveErrorMessage(received: HTMLElement, expectedMessage: string) {
    const errorElement = received.querySelector('[role="alert"]');
    const message = errorElement?.textContent ?? '';
    const pass = message.includes(expectedMessage);

    return {
      message: () =>
        `expected element to ${pass ? 'not ' : ''}have error message "${expectedMessage}"`,
      pass,
    };
  },
});

// Define types for user and auth state
export interface TestUser extends Omit<User, 'id'> {
  id: string;
}

interface RenderOptions {
  initialAuth?: {
    user: TestUser | null;
    loading?: boolean;
  };
}

// Wrapper component that includes providers required for testing
function Wrapper({ children, initialAuth }: { children: ReactNode; initialAuth?: RenderOptions['initialAuth'] }) {
  Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true
  });    return (
    <AuthProvider initialState={initialAuth}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <>{children}</>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Custom render function that includes providers and handles async updates
async function render(ui: React.ReactElement, options: RenderOptions = {}) {
  let rendered: ReturnType<typeof testingLibraryRender>;
  
  // Ensure any previous cleanup is complete
  cleanup();
  
  // Reset location mock
  mockLocation.href = 'http://localhost:3000/';
  mockLocation.pathname = '/';
  mockLocation.search = '';
  mockLocation.hash = '';

  // Mock theme to prevent hydration issues
  vi.mock('next-themes', () => ({
    useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
  }));
  
  await act(async () => {
    rendered = testingLibraryRender(ui, {
      wrapper: ({ children }) => (
        <Wrapper initialAuth={options.initialAuth}>
          {children}
        </Wrapper>
      ),
    });
  });

  // Wait for any dynamic imports, theme initialization, and state updates
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  return rendered!;
}

// Reset location mock between tests
beforeEach(() => {
  mockLocation.href = 'http://localhost:3000/';
  mockLocation.pathname = '/';
  mockLocation.search = '';
  mockLocation.hash = '';
  vi.clearAllMocks();
});

export { render, mockLocation };
