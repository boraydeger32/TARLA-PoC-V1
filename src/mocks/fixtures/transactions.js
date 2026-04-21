export const transactionsFixture = Array.from({ length: 40 }).map((_, i) => {
  const statuses = ['completed', 'completed', 'completed', 'pending', 'failed', 'refunded'];
  const status = statuses[i % statuses.length];
  const pkgs = ['pkg-01', 'pkg-02', 'pkg-03'];
  const pkgId = pkgs[i % pkgs.length];
  const amounts = { 'pkg-01': 299, 'pkg-02': 499, 'pkg-03': 1499 };
  return {
    id: `tx-${String(i + 1).padStart(5, '0')}`,
    user_id: `u-end-${String(1 + (i % 27)).padStart(2, '0')}`,
    package_id: pkgId,
    amount: amounts[pkgId],
    currency: 'TRY',
    status,
    provider: 'iyzico',
    provider_ref: `IYZ-${Date.now()}-${i}`,
    created_at: `2026-04-${String(1 + (i % 20)).padStart(2, '0')}T${String(8 + (i % 12)).padStart(2, '0')}:00:00Z`,
    updated_at: `2026-04-${String(1 + (i % 20)).padStart(2, '0')}T${String(9 + (i % 12)).padStart(2, '0')}:00:00Z`,
  };
});
