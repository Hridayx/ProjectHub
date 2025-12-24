import { render as testingLibraryRender } from '@testing-library/react';
import * as rtl from '@testing-library/react';
import { AuthProvider } from '@/components/auth-provider';
import type { ReactNode } from 'react';
import { expect, vi, beforeEach } from 'vitest';
import type { User } from '@/types/auth';
import { ThemeProvider } from '@/components/theme-provider';
import { act } from '@testing-library/react';

export const { screen, waitFor, fireEvent, within, cleanup } = rtl;

// Mock Next.js router
const mockRouter = {
  push: vi.fn().mockImplementation(async (url: string) => {
    await act(async () => {
      // Update pathname synchronously to match Next.js behavior
      mockLocation.pathname = url.startsWith('/') ? url : new URL(url).pathname;
      // Update href
      mockLocation.href = url.startsWith('/') 
        ? `http://localhost:3000${url}` 
        : url;
    });
    return Promise.resolve(true);
  }),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  replace: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.location
export const mockLocation = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  async assign(url: string) {
    await act(async () => {
      if (url.startsWith('/')) {
        this.pathname = url;
        this.href = `http://localhost:3000${url}`;
      } else {
        this.href = url;
        this.pathname = new URL(url).pathname;
      }
      this.search = new URL(this.href).search;
    });
  },
  replace: vi.fn(),
  reload: vi.fn()
};

// Define test user type
export interface TestUser extends Omit<User, 'id'> {
  id: string;
}

interface RenderOptions {
  initialAuth?: {
    user: TestUser | null;
    loading?: boolean;
  };
}

// Wrapper component for tests
function Wrapper({ children, initialAuth }: { children: ReactNode; initialAuth?: RenderOptions['initialAuth'] }) {
  Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
    configurable: true
  });

  return (
    <AuthProvider initialState={initialAuth}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}

// Custom render function
export async function render(ui: React.ReactElement, options: RenderOptions = {}) {
  cleanup();
  
  // Reset location mock
  mockLocation.href = 'http://localhost:3000/';
  mockLocation.pathname = '/';
  mockLocation.search = '';
  mockLocation.hash = '';

  let rendered: ReturnType<typeof testingLibraryRender>;

  await act(async () => {
    rendered = testingLibraryRender(ui, {
      wrapper: ({ children }) => (
        <Wrapper initialAuth={options.initialAuth}>
          {children}
        </Wrapper>
      ),
    });
  });

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return rendered!;
}

// Add custom matchers
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