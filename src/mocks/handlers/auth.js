import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { usersFixture } from '../fixtures/users.js';
import { delay, nowIso } from '../utils.js';

const BASE = apiBaseUrl();

/** Mock token — any string shape that looks jwt-ish is fine for dev. */
const mockAccessToken = (userId) => `mock.access.${userId}.${Date.now()}`;
const mockRefreshToken = (userId) => `mock.refresh.${userId}.${Date.now()}`;

function publicUser(u) {
  const { password: _pw, ...rest } = u;
  return rest;
}

export const authHandlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    await delay(150);
    const body = await request.json().catch(() => ({}));
    const byEmail = usersFixture.find((u) => u.email === body?.email);
    const fallback = usersFixture.find((u) => u.role === 'super_admin') ?? usersFixture[0];
    const user = byEmail ?? fallback;
    return HttpResponse.json({
      access_token: mockAccessToken(user.id),
      refresh_token: mockRefreshToken(user.id),
      user: publicUser(user),
    });
  }),

  http.post(`${BASE}/auth/refresh`, async ({ request }) => {
    await delay(150);
    const body = await request.json();
    const token = String(body?.refresh_token ?? '');
    const match = token.match(/^mock\.refresh\.(u-[\w-]+)\./);
    if (!match) {
      return HttpResponse.json({ detail: 'Refresh token invalid' }, { status: 401 });
    }
    const userId = match[1];
    const user = usersFixture.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ detail: 'User not found' }, { status: 401 });
    }
    return HttpResponse.json({
      access_token: mockAccessToken(user.id),
      refresh_token: mockRefreshToken(user.id),
    });
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    await delay(80);
    return HttpResponse.json({ success: true, logged_out_at: nowIso() });
  }),

  http.get(`${BASE}/auth/me`, async ({ request }) => {
    await delay(120);
    const auth = request.headers.get('authorization') ?? '';
    const match = auth.match(/Bearer mock\.access\.(u-[\w-]+)\./);
    if (!match) {
      return HttpResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }
    const user = usersFixture.find((u) => u.id === match[1]);
    if (!user) {
      return HttpResponse.json({ detail: 'User not found' }, { status: 401 });
    }
    return HttpResponse.json(publicUser(user));
  }),
];
