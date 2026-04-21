import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { categoriesFixture } from '../fixtures/categories.js';
import { delay, nowIso, paginate, uid } from '../utils.js';

const BASE = apiBaseUrl();
let categories = [...categoriesFixture];

function tree(list) {
  const byParent = new Map();
  for (const cat of list) {
    const key = cat.parent_id ?? '__root__';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(cat);
  }
  const attach = (parentKey) =>
    (byParent.get(parentKey) ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => ({ ...c, children: attach(c.id) }));
  return attach('__root__');
}

export const categoriesHandlers = [
  http.get(`${BASE}/categories`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 50);
    return HttpResponse.json(paginate(categories, { page, size }));
  }),

  http.get(`${BASE}/categories/tree`, async () => {
    await delay();
    return HttpResponse.json(tree(categories));
  }),

  http.get(`${BASE}/categories/:id`, async ({ params }) => {
    await delay();
    const cat = categories.find((c) => c.id === params.id);
    if (!cat) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    return HttpResponse.json(cat);
  }),

  http.post(`${BASE}/categories`, async ({ request }) => {
    await delay();
    const body = await request.json();
    const newCat = {
      id: uid('c'),
      listings_count: 0,
      created_at: nowIso(),
      updated_at: nowIso(),
      ...body,
    };
    categories = [...categories, newCat];
    return HttpResponse.json(newCat, { status: 201 });
  }),

  http.patch(`${BASE}/categories/:id`, async ({ params, request }) => {
    await delay();
    const idx = categories.findIndex((c) => c.id === params.id);
    if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    const body = await request.json();
    categories[idx] = { ...categories[idx], ...body, updated_at: nowIso() };
    return HttpResponse.json(categories[idx]);
  }),

  http.delete(`${BASE}/categories/:id`, async ({ params }) => {
    await delay();
    categories = categories.filter((c) => c.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BASE}/categories/reorder`, async ({ request }) => {
    await delay();
    const body = await request.json();
    const ids = body?.ids ?? [];
    categories = categories.map((c) => {
      const idx = ids.indexOf(c.id);
      return idx >= 0 ? { ...c, sort_order: idx, updated_at: nowIso() } : c;
    });
    return HttpResponse.json({ success: true });
  }),
];
