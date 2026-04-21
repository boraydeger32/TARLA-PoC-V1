import { http, HttpResponse } from 'msw';
import { apiBaseUrl } from '@/utils/env.js';
import { locationsFixture } from '../fixtures/locations.js';
import { delay, paginate } from '../utils.js';

const BASE = apiBaseUrl();
const locations = [...locationsFixture];

export const locationsHandlers = [
  http.get(`${BASE}/locations`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 100);
    return HttpResponse.json(paginate(locations, { page, size }));
  }),

  http.get(`${BASE}/locations/provinces`, async () => {
    await delay();
    return HttpResponse.json({
      items: locations.filter((l) => l.level === 'province'),
    });
  }),

  http.get(`${BASE}/locations/districts`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const provinceId = url.searchParams.get('province_id');
    return HttpResponse.json({
      items: locations.filter((l) => l.level === 'district' && l.parent_id === provinceId),
    });
  }),

  http.get(`${BASE}/locations/neighborhoods`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const districtId = url.searchParams.get('district_id');
    return HttpResponse.json({
      items: locations.filter(
        (l) => l.level === 'neighborhood' && l.parent_id === districtId,
      ),
    });
  }),

  http.get(`${BASE}/locations/:id`, async ({ params }) => {
    await delay();
    const loc = locations.find((l) => l.id === params.id);
    if (!loc) return HttpResponse.json({ detail: 'Not found' }, { status: 404 });
    return HttpResponse.json(loc);
  }),
];
