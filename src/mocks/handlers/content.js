import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { bannersFixture, faqsFixture, blogFixture } from '../fixtures/content.js';
import { delay, nowIso, paginate, uid } from '../utils.js';

const BASE = apiBaseUrl();
let banners = [...bannersFixture];
let faqs = [...faqsFixture];
let blog = [...blogFixture];

function crud(name, store, setStore, opts = {}) {
  const url = `${BASE}/content/${name}`;
  const extras = opts.extras ?? [];
  return [
    http.get(url, async ({ request }) => {
      await delay();
      const u = new URL(request.url);
      return HttpResponse.json(
        paginate(store(), {
          page: Number(u.searchParams.get('page') ?? 1),
          size: Number(u.searchParams.get('size') ?? 25),
        }),
      );
    }),
    http.get(`${url}/:id`, async ({ params }) => {
      await delay();
      const item = store().find((x) => x.id === params.id);
      if (!item) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
      return HttpResponse.json(item);
    }),
    http.post(url, async ({ request }) => {
      await delay();
      const body = await request.json();
      const item = { id: uid(name.slice(0, 3)), created_at: nowIso(), updated_at: nowIso(), ...body };
      setStore([...store(), item]);
      return HttpResponse.json(item, { status: 201 });
    }),
    http.patch(`${url}/:id`, async ({ params, request }) => {
      await delay();
      const curr = store();
      const idx = curr.findIndex((x) => x.id === params.id);
      if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
      const body = await request.json();
      const next = [...curr];
      next[idx] = { ...curr[idx], ...body, updated_at: nowIso() };
      setStore(next);
      return HttpResponse.json(next[idx]);
    }),
    http.delete(`${url}/:id`, async ({ params }) => {
      await delay();
      setStore(store().filter((x) => x.id !== params.id));
      return HttpResponse.json({ success: true });
    }),
    ...extras.map((fn) => fn(url, store, setStore)),
  ];
}

export const contentHandlers = [
  ...crud('banners', () => banners, (v) => { banners = v; }),
  ...crud('faqs', () => faqs, (v) => { faqs = v; }, {
    extras: [
      (url, store, setStore) =>
        http.post(`${url}/reorder`, async ({ request }) => {
          await delay();
          const body = await request.json();
          const ids = body?.ids ?? [];
          setStore(
            store().map((x) => {
              const idx = ids.indexOf(x.id);
              return idx >= 0 ? { ...x, sort_order: idx, updated_at: nowIso() } : x;
            }),
          );
          return HttpResponse.json({ success: true });
        }),
    ],
  }),
  ...crud('blog', () => blog, (v) => { blog = v; }, {
    extras: [
      (url, store, setStore) =>
        http.post(`${url}/:id/publish`, async ({ params }) => {
          await delay();
          const curr = store();
          const idx = curr.findIndex((x) => x.id === params.id);
          if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
          const next = [...curr];
          next[idx] = {
            ...curr[idx],
            is_published: true,
            published_at: nowIso(),
            updated_at: nowIso(),
          };
          setStore(next);
          return HttpResponse.json(next[idx]);
        }),
      (url, store, setStore) =>
        http.post(`${url}/:id/unpublish`, async ({ params }) => {
          await delay();
          const curr = store();
          const idx = curr.findIndex((x) => x.id === params.id);
          if (idx < 0) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
          const next = [...curr];
          next[idx] = { ...curr[idx], is_published: false, updated_at: nowIso() };
          setStore(next);
          return HttpResponse.json(next[idx]);
        }),
    ],
  }),
];
