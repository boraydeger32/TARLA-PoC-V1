export const settingsFixture = [
  {
    id: 's-01',
    key: 'site.name',
    value: 'Aperant',
    description: 'Görünen site adı',
    is_public: true,
    updated_at: '2025-10-01T09:00:00Z',
  },
  {
    id: 's-02',
    key: 'support.email',
    value: 'destek@aperant.tr',
    description: 'Kullanıcı destek e-posta adresi',
    is_public: true,
    updated_at: '2025-10-01T09:00:00Z',
  },
  {
    id: 's-03',
    key: 'listings.approval.required',
    value: true,
    description: 'Yeni ilanlar yayınlanmadan önce admin onayı gerekiyor mu',
    is_public: false,
    updated_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 's-04',
    key: 'listings.max_per_user',
    value: 25,
    description: 'Bir kullanıcının sahip olabileceği maksimum aktif ilan sayısı',
    is_public: false,
    updated_at: '2026-02-01T09:00:00Z',
  },
];
