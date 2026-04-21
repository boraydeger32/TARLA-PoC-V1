import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { dashboardStatsFixture, generateTrendSeries } from '../fixtures/dashboard.js';
import { delay } from '../utils.js';

const BASE = apiBaseUrl();

export const dashboardHandlers = [
  http.get(`${BASE}/dashboard/stats`, async () => {
    await delay();
    return HttpResponse.json(dashboardStatsFixture);
  }),

  http.get(`${BASE}/dashboard/stats/trend`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const metric = url.searchParams.get('metric') ?? 'listings';
    const range = Number(url.searchParams.get('range_days') ?? 30);
    return HttpResponse.json({ metric, range_days: range, series: generateTrendSeries(metric, range) });
  }),
];
