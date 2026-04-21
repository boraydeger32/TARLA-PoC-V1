export const dashboardStatsFixture = {
  active_listings: 214,
  active_listings_change_pct: 8.3,
  pending_approvals: 17,
  total_users: 1843,
  total_users_growth_pct: 5.7,
  revenue_this_month: 48250,
  revenue_currency: 'TRY',
  recent_activity: Array.from({ length: 10 }).map((_, i) => ({
    id: `ra-${i + 1}`,
    actor_email: i % 2 === 0 ? 'moderator@aperant.tr' : 'super@aperant.tr',
    action: ['listing.approve', 'listing.reject', 'user.suspend', 'report.resolve'][i % 4],
    target_id: `tgt-${1000 + i}`,
    created_at: `2026-04-21T${String(14 - i).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}:00Z`,
  })),
};

export function generateTrendSeries(metric, rangeDays) {
  const base = { listings: 8, users: 22, revenue: 1200 }[metric] ?? 10;
  return Array.from({ length: rangeDays }).map((_, i) => ({
    date: new Date(Date.now() - (rangeDays - i - 1) * 86400_000).toISOString().slice(0, 10),
    value: Math.round(base + Math.sin(i / 3) * (base / 2) + (i % 5)),
  }));
}
