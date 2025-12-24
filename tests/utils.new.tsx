import { render as testingLibraryRender, type RenderOptions as RTLRenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/components/auth-provider';
import type { ReactNode } from 'react';
import { expect, vi, beforeEach } from 'vitest';
import type { User } from '@/types/auth';
import { ThemeProvider } from '@/components/theme-provider';
import { act } from '@testing-library/react';
import * as testingLibrary from '@testing-library/react';

// Re-export testing library
export const { screen, waitFor, fireEvent, within, cleanup } = testingLibrary;

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: (url: string) => {
      mockLocation.assign(url);
    },
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Mock window.location
export const mockLocation = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign(url: string) {
    if (url.startsWith('/')) {
      this.href = `http://localhost:3000${url}`;
    } else {
      this.href = url;
    }
    this.pathname = new URL(this.href).pathname;
    this.search = new URL(this.href).search;
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

// Wrapper component for tests
function Wrapper({ children, initialAuth }: { children: ReactNode; initialAuth?: RenderOptions['initialAuth'] }) {
  Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true
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
async function customRender(ui: React.ReactElement, options: RenderOptions = {}) {
  testingLibrary.cleanup();
  
  // Reset mocks
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

// Reset mocks between tests
beforeEach(() => {
  mockLocation.href = 'http://localhost:3000/';
  mockLocation.pathname = '/';
  mockLocation.search = '';
  mockLocation.hash = '';
  vi.clearAllMocks();
});

// Export render function
export { customRender as render };
