import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock successful login
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    
    if (body.email === 'test.user@mahindrauniversity.edu.in' && body.password === 'ValidPass123!') {
      return HttpResponse.json({ success: true });
    }
    
    return HttpResponse.json(
      { error: { code: 'auth/invalid-credentials', message: 'Invalid email or password' } },
      { status: 401 }
    );
  }),

  // Mock registration
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json();
    
    if (body.email === 'test.user@mahindrauniversity.edu.in') {
      return HttpResponse.json(
        { error: { code: 'auth/user-exists', message: 'User already exists' } },
        { status: 400 }
      );
    }
    
    if (body.email === 'new.user@mahindrauniversity.edu.in') {
      return HttpResponse.json({ success: true });
    }

    return HttpResponse.json(
      { error: { code: 'auth/validation-error', message: 'Invalid registration data' } },
      { status: 400 }
    );
  }),

  // Mock auth check
  http.get('/api/auth/check', () => {
    return HttpResponse.json({ isAuthenticated: false });
  }),
];
