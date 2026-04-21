/**
 * Shared helpers for MSW handlers — pagination, search, latency simulation.
 */

/** Uniform artificial latency so loading states are visible during dev. */
export const delay = (ms = 180) => new Promise((res) => setTimeout(res, ms));

/**
 * @template T
 * @param {T[]} items
 * @param {{ page?: number, size?: number }} params
 */
export function paginate(items, { page = 1, size = 25 } = {}) {
  const p = Math.max(1, Number(page) || 1);
  const s = Math.max(1, Math.min(200, Number(size) || 25));
  const start = (p - 1) * s;
  const end = start + s;
  const sliced = items.slice(start, end);
  return {
    items: sliced,
    total: items.length,
    page: p,
    size: s,
    pages: Math.max(1, Math.ceil(items.length / s)),
  };
}

export function filterByQuery(items, query, fields) {
  if (!query) return items;
  const q = String(query).toLowerCase();
  return items.filter((it) => fields.some((f) => String(it[f] ?? '').toLowerCase().includes(q)));
}

export function equalsFilter(items, key, value) {
  if (value === undefined || value === null || value === '' || value === 'all') return items;
  return items.filter((it) => String(it[key]) === String(value));
}

export function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function nowIso() {
  return new Date().toISOString();
}
