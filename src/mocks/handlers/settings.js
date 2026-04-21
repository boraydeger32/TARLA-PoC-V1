import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { settingsFixture } from '../fixtures/settings.js';
import { delay, nowIso } from '../utils.js';

const BASE = apiBaseUrl();
let settings = [...settingsFixture];

export const settingsHandlers = [
  http.get(`${BASE}/settings`, async () => {
    await delay();
    return HttpResponse.json({ items: settings });
  }),

  http.get(`${BASE}/settings/:key`, async ({ params }) => {
    await delay();
    const s = settings.find((x) => x.key === params.key);
    if (!s) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    return HttpResponse.json(s);
  }),

  http.patch(`${BASE}/settings/:key`, async ({ params, request }) => {
    await delay();
    const body = await request.json();
    const idx = settings.findIndex((x) => x.key === params.key);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    settings[idx] = { ...settings[idx], value: body.value, updated_at: nowIso() };
    return HttpResponse.json(settings[idx]);
  }),
];
