import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { reportsFixture } from '../fixtures/reports.js';
import { listingsFixture } from '../fixtures/listings.js';
import { delay, paginate } from '../utils.js';

const BASE = apiBaseUrl();

function buildQueue() {
  const pending = listingsFixture
    .filter((l) => l.status === 'pending')
    .map((l) => ({
      id: `mq-listing-${l.id}`,
      type: 'listing_pending',
      target_type: 'listing',
      target_id: l.id,
      title: l.title,
      created_at: l.created_at,
      priority: 'medium',
    }));
  const reported = reportsFixture
    .filter((r) => r.status === 'open' || r.status === 'in_review')
    .map((r) => ({
      id: `mq-report-${r.id}`,
      type: 'report',
      target_type: r.target_type,
      target_id: r.target_id,
      title: r.reason,
      created_at: r.created_at,
      priority: 'high',
    }));
  return [...reported, ...pending].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export const moderationHandlers = [
  http.get(`${BASE}/moderation/queue`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    return HttpResponse.json(paginate(buildQueue(), { page, size }));
  }),

  http.post(`${BASE}/moderation/warn`, async () => {
    await delay();
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BASE}/moderation/remove`, async () => {
    await delay();
    return HttpResponse.json({ success: true });
  }),
];
