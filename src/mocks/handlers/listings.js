import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { listingsFixture } from '../fixtures/listings.js';
import { delay, equalsFilter, filterByQuery, nowIso, paginate, uid } from '../utils.js';

const BASE = apiBaseUrl();
let listings = [...listingsFixture];

function applyFilters(items, url) {
  const q = url.searchParams.get('q');
  const status = url.searchParams.get('status');
  const categoryId = url.searchParams.get('category_id');
  const locationId = url.searchParams.get('location_id');
  let out = filterByQuery(items, q, ['title', 'description']);
  out = equalsFilter(out, 'status', status);
  out = equalsFilter(out, 'category_id', categoryId);
  out = equalsFilter(out, 'location_id', locationId);
  return out;
}

export const listingsHandlers = [
  http.get(`${BASE}/listings`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const filtered = applyFilters(listings, url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    return HttpResponse.json(paginate(filtered, { page, size }));
  }),

  http.get(`${BASE}/listings/:id`, async ({ params }) => {
    await delay();
    const item = listings.find((l) => l.id === params.id);
    if (!item) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    return HttpResponse.json(item);
  }),

  http.post(`${BASE}/listings`, async ({ request }) => {
    await delay();
    const body = await request.json();
    const newItem = {
      id: uid('lst'),
      status: 'pending',
      owner_id: 'u-admin-01',
      view_count: 0,
      favorite_count: 0,
      featured_until: null,
      media: [],
      approved_at: null,
      approved_by: null,
      created_at: nowIso(),
      updated_at: nowIso(),
      ...body,
    };
    listings = [newItem, ...listings];
    return HttpResponse.json(newItem, { status: 201 });
  }),

  http.patch(`${BASE}/listings/:id`, async ({ params, request }) => {
    await delay();
    const idx = listings.findIndex((l) => l.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    const body = await request.json();
    listings[idx] = { ...listings[idx], ...body, updated_at: nowIso() };
    return HttpResponse.json(listings[idx]);
  }),

  http.delete(`${BASE}/listings/:id`, async ({ params }) => {
    await delay();
    listings = listings.filter((l) => l.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BASE}/listings/:id/approve`, async ({ params }) => {
    await delay();
    const idx = listings.findIndex((l) => l.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    listings[idx] = {
      ...listings[idx],
      status: 'approved',
      approved_at: nowIso(),
      approved_by: 'u-admin-02',
      updated_at: nowIso(),
    };
    return HttpResponse.json(listings[idx]);
  }),

  http.post(`${BASE}/listings/:id/reject`, async ({ params, request }) => {
    await delay();
    const body = await request.json().catch(() => ({}));
    const idx = listings.findIndex((l) => l.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    listings[idx] = {
      ...listings[idx],
      status: 'rejected',
      updated_at: nowIso(),
      rejection_reason: body?.reason ?? null,
    };
    return HttpResponse.json(listings[idx]);
  }),

  http.post(`${BASE}/listings/:id/feature`, async ({ params, request }) => {
    await delay();
    const body = await request.json().catch(() => ({}));
    const idx = listings.findIndex((l) => l.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    const days = Number(body?.duration_days ?? 7);
    const until = new Date(Date.now() + days * 86400_000).toISOString();
    listings[idx] = { ...listings[idx], featured_until: until, updated_at: nowIso() };
    return HttpResponse.json(listings[idx]);
  }),

  http.post(`${BASE}/listings/:id/archive`, async ({ params }) => {
    await delay();
    const idx = listings.findIndex((l) => l.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    listings[idx] = { ...listings[idx], status: 'archived', updated_at: nowIso() };
    return HttpResponse.json(listings[idx]);
  }),
];
