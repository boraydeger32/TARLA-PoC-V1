import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { auditLogsFixture, activityLogsFixture } from '../fixtures/logs.js';
import { delay, equalsFilter, paginate } from '../utils.js';

const BASE = apiBaseUrl();

export const logsHandlers = [
  http.get(`${BASE}/logs/audit`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    let out = equalsFilter(auditLogsFixture, 'action', url.searchParams.get('action'));
    out = equalsFilter(out, 'actor_id', url.searchParams.get('actor_id'));
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    return HttpResponse.json(paginate(out, { page, size }));
  }),

  http.get(`${BASE}/logs/activity`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    let out = equalsFilter(activityLogsFixture, 'event', url.searchParams.get('event'));
    out = equalsFilter(out, 'user_id', url.searchParams.get('user_id'));
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    return HttpResponse.json(paginate(out, { page, size }));
  }),
];
