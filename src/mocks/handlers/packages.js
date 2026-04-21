import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { packagesFixture } from '../fixtures/packages.js';
import { delay, nowIso, paginate, uid } from '../utils.js';

const BASE = apiBaseUrl();
let packages = [...packagesFixture];

export const packagesHandlers = [
  http.get(`${BASE}/packages`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    return HttpResponse.json(paginate(packages, { page, size }));
  }),

  http.get(`${BASE}/packages/:id`, async ({ params }) => {
    await delay();
    const p = packages.find((x) => x.id === params.id);
    if (!p) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    return HttpResponse.json(p);
  }),

  http.post(`${BASE}/packages`, async ({ request }) => {
    await delay();
    const body = await request.json();
    const np = { id: uid('pkg'), created_at: nowIso(), updated_at: nowIso(), ...body };
    packages = [...packages, np];
    return HttpResponse.json(np, { status: 201 });
  }),

  http.patch(`${BASE}/packages/:id`, async ({ params, request }) => {
    await delay();
    const idx = packages.findIndex((x) => x.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    const body = await request.json();
    packages[idx] = { ...packages[idx], ...body, updated_at: nowIso() };
    return HttpResponse.json(packages[idx]);
  }),

  http.delete(`${BASE}/packages/:id`, async ({ params }) => {
    await delay();
    packages = packages.filter((x) => x.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BASE}/packages/:id/activate`, async ({ params }) => {
    await delay();
    const idx = packages.findIndex((x) => x.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    packages[idx] = { ...packages[idx], is_active: true, updated_at: nowIso() };
    return HttpResponse.json(packages[idx]);
  }),

  http.post(`${BASE}/packages/:id/deactivate`, async ({ params }) => {
    await delay();
    const idx = packages.findIndex((x) => x.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    packages[idx] = { ...packages[idx], is_active: false, updated_at: nowIso() };
    return HttpResponse.json(packages[idx]);
  }),
];
