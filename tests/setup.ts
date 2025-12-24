import '@testing-library/jest-dom';
import { expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import * as dotenv from 'dotenv';
import type { ReactElement } from 'react';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Ensure JWT_SECRET is available
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret';
}

expect.extend(matchers as any);

// Mock location and router setup
const mockLocation = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: vi.fn((url: string) => {
    mockLocation.href = url;
  })
};

const mockRouter = {
  push: vi.fn((url: string) => {
    mockLocation.href = url.startsWith('http') ? url : `http://localhost:3000${url}`;
  }),
  replace: vi.fn(),
  refresh: vi.fn(),
};

// Mock window.location
const windowLocation = {
  ...mockLocation,
  toString: () => mockLocation.href
};

Object.defineProperty(window, 'location', {
  value: windowLocation,
  writable: true,
  configurable: true
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    ...mockRouter,
    push: (url: string) => {
      windowLocation.assign(url);
    }
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock window.matchMedia and localStorage for next-themes
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated but used by next-themes
    removeListener: vi.fn(), // Deprecated but used by next-themes
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: ReactElement }) => children,
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0,
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock ResizeObserver with proper TypeScript types
interface ResizeObserverSize {
  blockSize: number;
  inlineSize: number;
}

interface ResizeObserverEntry {
  target: Element;
  contentRect: DOMRectReadOnly;
  borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
}

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock;
window.ResizeObserver = ResizeObserverMock;

global.fetch = vi.fn();

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn().mockImplementation((name: string) => ({
      name,
      value: name === 'auth-token' ? 'test.jwt.token' : undefined
    })),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

afterEach(() => {
  vi.resetAllMocks();
  cleanup();
});

interface AuthRequest {
  email: string;
  password?: string;
  username?: string;
  rememberMe?: boolean;
}

const handlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as AuthRequest;
      if (!body.email.endsWith('@mahindrauniversity.edu.in')) {
      return HttpResponse.json(
        {
          error: {
            code: 'auth/invalid-email-domain',
            message: 'Only @mahindrauniversity.edu.in email addresses are allowed',
            status: 400,
          },
        },
        { status: 400 }
      );
    }

    if (body.email === 'test.user@mahindrauniversity.edu.in') {
      return HttpResponse.json(
        {
          error: {
            code: 'auth/user-exists',
            message: 'A user with this email already exists',
            status: 409,
          },
        },
        { status: 409 }
      );
    }

    return HttpResponse.json(
      {
        user: {
          id: 'test-id',
          email: body.email,
          username: body.username ?? 'testuser',
          role: 'student',
          isVerified: false,
        },
      },
      { status: 201 }
    );
  }),
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as AuthRequest;
    
    if (
      body.email === 'test.user@mahindrauniversity.edu.in' &&
      body.password === 'Test@123Password'
    ) {
      const maxAge = body.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
      return HttpResponse.json(
        {
          user: {
            id: 'test-id',
            email: body.email,
            username: 'testuser',
            role: 'student',
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
        },
        { 
          status: 200,
          headers: {
            'Set-Cookie': `auth-token=test.jwt.token; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`,
          },
        }
      );
    }

    return HttpResponse.json(
      {
        error: {
          code: 'auth/invalid-credentials',
          message: 'Invalid email or password',
          status: 401,
        },
      },
      { status: 401 }
    );
  }),
  http.get('/api/auth/check', async ({ request }) => {
    const authToken = request.headers.get('Cookie')?.includes('auth-token=test.jwt.token');

    if (!authToken) {
      return HttpResponse.json(
        {
          error: {
            code: 'auth/unauthorized',
            message: 'You must be logged in to access this resource',
            status: 401,
          },
        },
        { status: 401 }
      );
    }

    return HttpResponse.json(
      {
        user: {
          id: 'test-id',
          email: 'test.user@mahindrauniversity.edu.in',
          username: 'testuser',
          role: 'student',
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      },
      { status: 200 }
    );
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json(
      { message: 'Logged out successfully' },
      {
        status: 200,
        headers: {
          'Set-Cookie': 'auth-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
        },
      }
    );
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
