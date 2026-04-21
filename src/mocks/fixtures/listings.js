/**
 * Seed ilanları — 60 kayıt, farklı durum ve kategorilerde. Admin panel
 * tablosu (Grid.js) için yeterli çeşitlilik sağlar.
 */
const TITLES = [
  'Silivri Çantaköy Bölgesinde Müstakil Tapulu Yatırımlık Arsa',
  'Bodrum Turgutreis Satılık Denize Yakın Konut İmarlı Arsa',
  'İzmir Urla Merkeze 10 dk Zeytinlikli Tarla',
  'Ankara Polatlı Bağlıca Köy Yerleşik Alan İçi Arsa',
  'Muğla Milas Sahibinden Satılık Taşlıca Köyü Tarlası',
  'Çeşme Alaçatı Kuş Uçmaz Bölgesi Villa İmarlı',
  'Antalya Manavgat Sarılar Satılık Tarla',
  'Bursa İznik Sansarak Kanyonu Yakını Bağ',
  'Çatalca Akalan Köyü Ticari İmarlı Arsa',
  'İstanbul Şile Meşrutiyet Köyü İmarsız Tarım Arazisi',
];

const DESCRIPTIONS = [
  'Müstakil tapulu, köy yerleşik alanı içinde, yola cepheli arsa. Tüm altyapı hazır, elektrik-su bağlantısı yapılabilir. Yatırıma uygundur.',
  'Denize yürüme mesafesinde, konut imarlı, E: 0.50 H: 6.50 yapılaşma koşullu arsa. Villa yapımına uygun. Müstakil tapu.',
  'Organik tarıma uygun verimli toprak, zeytin ağaçlı, yola cepheli tarla. Sulama suyu mevcut. Çiftlik evi yapılabilir.',
  'Ana yola 2 km mesafede, düz ve kare geometride arsa. Komşu parsellere göre fiyat avantajlı. Müstakil tapu.',
];

const CATS = ['c-01', 'c-02', 'c-03', 'c-04', 'c-05', 'c-06'];
const LOCS = [
  'loc-34-silivri',
  'loc-48-bodrum',
  'loc-35-urla',
  'loc-35-cesme',
  'loc-34-catalca',
];
const ZONINGS = ['imarli', 'imarsiz', 'koy_yerlesik', 'tarim', 'ihtilafli'];
const STATUSES = [
  'approved',
  'approved',
  'approved',
  'approved',
  'pending',
  'pending',
  'rejected',
  'draft',
  'expired',
];
const OWNERS = ['u-end-01', 'u-end-02', 'u-end-04', 'u-end-05', 'u-end-06'];

export const listingsFixture = Array.from({ length: 60 }).map((_, i) => {
  const status = STATUSES[i % STATUSES.length];
  const createdDay = 1 + (i % 28);
  const createdMonth = 1 + (i % 4);
  return {
    id: `lst-${String(i + 1).padStart(4, '0')}`,
    title: TITLES[i % TITLES.length],
    description: DESCRIPTIONS[i % DESCRIPTIONS.length],
    price: 450000 + i * 37500,
    currency: 'TRY',
    category_id: CATS[i % CATS.length],
    location_id: LOCS[i % LOCS.length],
    area_m2: 500 + (i % 20) * 250,
    zoning_status: ZONINGS[i % ZONINGS.length],
    status,
    owner_id: OWNERS[i % OWNERS.length],
    view_count: (i * 23) % 1200,
    favorite_count: (i * 5) % 40,
    featured_until: i % 9 === 0 ? '2026-05-15T00:00:00Z' : null,
    media: [
      {
        id: `m-${i + 1}-1`,
        listing_id: `lst-${String(i + 1).padStart(4, '0')}`,
        url: `https://picsum.photos/seed/aperant${i + 1}/800/600`,
        type: 'image',
        alt: null,
        sort_order: 0,
        created_at: `2026-0${createdMonth}-${String(createdDay).padStart(2, '0')}T09:00:00Z`,
      },
    ],
    created_at: `2026-0${createdMonth}-${String(createdDay).padStart(2, '0')}T09:00:00Z`,
    updated_at: `2026-0${createdMonth}-${String(createdDay).padStart(2, '0')}T14:00:00Z`,
    approved_at: status === 'approved' ? `2026-0${createdMonth}-${String(createdDay + 1).padStart(2, '0')}T10:00:00Z` : null,
    approved_by: status === 'approved' ? 'u-admin-02' : null,
  };
});
