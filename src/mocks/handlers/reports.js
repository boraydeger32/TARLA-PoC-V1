import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { reportsFixture } from '../fixtures/reports.js';
import { delay, equalsFilter, nowIso, paginate } from '../utils.js';

const BASE = apiBaseUrl();
let reports = [...reportsFixture];

export const reportsHandlers = [
  http.get(`${BASE}/reports`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    let out = equalsFilter(reports, 'status', url.searchParams.get('status'));
    out = equalsFilter(out, 'target_type', url.searchParams.get('target_type'));
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    return HttpResponse.json(paginate(out, { page, size }));
  }),

  http.get(`${BASE}/reports/:id`, async ({ params }) => {
    await delay();
    const r = reports.find((x) => x.id === params.id);
    if (!r) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    return HttpResponse.json(r);
  }),

  http.post(`${BASE}/reports/:id/resolve`, async ({ params, request }) => {
    await delay();
    const body = await request.json().catch(() => ({}));
    const idx = reports.findIndex((x) => x.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    reports[idx] = {
      ...reports[idx],
      status: 'resolved',
      resolution_note: body?.resolution_note ?? null,
      resolved_by: 'u-admin-02',
      resolved_at: nowIso(),
      updated_at: nowIso(),
    };
    return HttpResponse.json(reports[idx]);
  }),

  http.post(`${BASE}/reports/:id/dismiss`, async ({ params, request }) => {
    await delay();
    const body = await request.json().catch(() => ({}));
    const idx = reports.findIndex((x) => x.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    reports[idx] = {
      ...reports[idx],
      status: 'dismissed',
      resolution_note: body?.resolution_note ?? null,
      resolved_by: 'u-admin-02',
      resolved_at: nowIso(),
      updated_at: nowIso(),
    };
    return HttpResponse.json(reports[idx]);
  }),
];
