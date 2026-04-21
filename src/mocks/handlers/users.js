import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { usersFixture } from '../fixtures/users.js';
import { delay, equalsFilter, filterByQuery, nowIso, paginate } from '../utils.js';

const BASE = apiBaseUrl();
let users = usersFixture.map(({ password: _pw, ...u }) => u);

export const usersHandlers = [
  http.get(`${BASE}/users`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    let out = filterByQuery(users, url.searchParams.get('q'), ['email', 'full_name', 'phone']);
    out = equalsFilter(out, 'role', url.searchParams.get('role'));
    out = equalsFilter(out, 'status', url.searchParams.get('status'));
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    return HttpResponse.json(paginate(out, { page, size }));
  }),

  http.get(`${BASE}/users/:id`, async ({ params }) => {
    await delay();
    const user = users.find((u) => u.id === params.id);
    if (!user) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    return HttpResponse.json(user);
  }),

  http.patch(`${BASE}/users/:id`, async ({ params, request }) => {
    await delay();
    const idx = users.findIndex((u) => u.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    const body = await request.json();
    users[idx] = { ...users[idx], ...body, updated_at: nowIso() };
    return HttpResponse.json(users[idx]);
  }),

  http.delete(`${BASE}/users/:id`, async ({ params }) => {
    await delay();
    users = users.filter((u) => u.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BASE}/users/:id/suspend`, async ({ params }) => {
    await delay();
    const idx = users.findIndex((u) => u.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    users[idx] = { ...users[idx], status: 'suspended', updated_at: nowIso() };
    return HttpResponse.json(users[idx]);
  }),

  http.post(`${BASE}/users/:id/unsuspend`, async ({ params }) => {
    await delay();
    const idx = users.findIndex((u) => u.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    users[idx] = { ...users[idx], status: 'active', updated_at: nowIso() };
    return HttpResponse.json(users[idx]);
  }),

  http.post(`${BASE}/users/:id/ban`, async ({ params }) => {
    await delay();
    const idx = users.findIndex((u) => u.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    users[idx] = { ...users[idx], status: 'banned', updated_at: nowIso() };
    return HttpResponse.json(users[idx]);
  }),

  http.post(`${BASE}/users/:id/role`, async ({ params, request }) => {
    await delay();
    const idx = users.findIndex((u) => u.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    const body = await request.json();
    users[idx] = { ...users[idx], role: body.role, updated_at: nowIso() };
    return HttpResponse.json(users[idx]);
  }),

  http.post(`${BASE}/users/:id/reset-password`, async () => {
    await delay();
    return HttpResponse.json({ success: true, temporary_password: 'Aperant2026!' });
  }),
];
