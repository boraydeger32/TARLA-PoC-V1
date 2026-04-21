/**
 * Centralized query-key factory. Never build query keys ad-hoc in a component
 * or service — always route through this object so invalidations stay in sync.
 */
export const queryKeys = Object.freeze({
  auth: Object.freeze({
    me: ['auth', 'me'],
  }),
  listings: Object.freeze({
    all: ['listings'],
    list: (params) => ['listings', 'list', params],
    detail: (id) => ['listings', 'detail', id],
    pending: ['listings', 'pending'],
  }),
  users: Object.freeze({
    all: ['users'],
    list: (params) => ['users', 'list', params],
    detail: (id) => ['users', 'detail', id],
  }),
  categories: Object.freeze({
    all: ['categories'],
    list: (params) => ['categories', 'list', params],
    tree: ['categories', 'tree'],
    detail: (id) => ['categories', 'detail', id],
  }),
  locations: Object.freeze({
    all: ['locations'],
    provinces: ['locations', 'provinces'],
    districts: (provinceId) => ['locations', 'districts', provinceId],
    neighborhoods: (districtId) => ['locations', 'neighborhoods', districtId],
  }),
  reports: Object.freeze({
    all: ['reports'],
    list: (params) => ['reports', 'list', params],
    detail: (id) => ['reports', 'detail', id],
  }),
  moderation: Object.freeze({
    all: ['moderation'],
    queue: (params) => ['moderation', 'queue', params],
  }),
  packages: Object.freeze({
    all: ['packages'],
    list: (params) => ['packages', 'list', params],
    detail: (id) => ['packages', 'detail', id],
  }),
  transactions: Object.freeze({
    all: ['transactions'],
    list: (params) => ['transactions', 'list', params],
    detail: (id) => ['transactions', 'detail', id],
  }),
  content: Object.freeze({
    banners: Object.freeze({
      all: ['content', 'banners'],
      list: (params) => ['content', 'banners', 'list', params],
      detail: (id) => ['content', 'banners', 'detail', id],
    }),
    faqs: Object.freeze({
      all: ['content', 'faqs'],
      list: (params) => ['content', 'faqs', 'list', params],
      detail: (id) => ['content', 'faqs', 'detail', id],
    }),
    blog: Object.freeze({
      all: ['content', 'blog'],
      list: (params) => ['content', 'blog', 'list', params],
      detail: (id) => ['content', 'blog', 'detail', id],
    }),
  }),
  dashboard: Object.freeze({
    stats: ['dashboard', 'stats'],
    trend: (metric, rangeDays) => ['dashboard', 'trend', metric, rangeDays],
  }),
  logs: Object.freeze({
    audit: (params) => ['logs', 'audit', params],
    activity: (params) => ['logs', 'activity', params],
  }),
  settings: Object.freeze({
    all: ['settings'],
    byKey: (key) => ['settings', key],
  }),
});
