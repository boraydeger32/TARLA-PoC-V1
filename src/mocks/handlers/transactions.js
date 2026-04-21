import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { transactionsFixture } from '../fixtures/transactions.js';
import { delay, equalsFilter, nowIso, paginate } from '../utils.js';

const BASE = apiBaseUrl();
let transactions = [...transactionsFixture];

export const transactionsHandlers = [
  http.get(`${BASE}/transactions`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    let out = equalsFilter(transactions, 'status', url.searchParams.get('status'));
    out = equalsFilter(out, 'user_id', url.searchParams.get('user_id'));
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    return HttpResponse.json(paginate(out, { page, size }));
  }),

  http.get(`${BASE}/transactions/:id`, async ({ params }) => {
    await delay();
    const t = transactions.find((x) => x.id === params.id);
    if (!t) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    return HttpResponse.json(t);
  }),

  http.post(`${BASE}/transactions/:id/refund`, async ({ params }) => {
    await delay();
    const idx = transactions.findIndex((x) => x.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    transactions[idx] = { ...transactions[idx], status: 'refunded', updated_at: nowIso() };
    return HttpResponse.json(transactions[idx]);
  }),

  http.get(`${BASE}/transactions/export`, async () => {
    await delay(400);
    const csv = 'id,user_id,package_id,amount,currency,status\n' +
      transactions.map((t) => `${t.id},${t.user_id},${t.package_id},${t.amount},${t.currency},${t.status}`).join('\n');
    return new HttpResponse(csv, {
      status: 200,
      headers: { 'Content-Type': 'text/csv' },
    });
  }),
];
