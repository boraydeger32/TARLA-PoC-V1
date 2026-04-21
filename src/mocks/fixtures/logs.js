export const auditLogsFixture = Array.from({ length: 30 }).map((_, i) => {
  const actions = [
    'listing.approve',
    'listing.reject',
    'listing.feature',
    'user.suspend',
    'user.unsuspend',
    'report.resolve',
    'package.update',
    'setting.update',
  ];
  const action = actions[i % actions.length];
  return {
    id: `al-${String(i + 1).padStart(5, '0')}`,
    actor_id: i % 3 === 0 ? 'u-admin-01' : 'u-admin-02',
    actor_email: i % 3 === 0 ? 'super@aperant.tr' : 'moderator@aperant.tr',
    action,
    target_type: action.split('.')[0],
    target_id: `${action.split('.')[0]}-${1000 + i}`,
    diff: null,
    ip_address: '10.0.0.15',
    user_agent: 'Mozilla/5.0',
    created_at: `2026-04-${String(21 - (i % 20)).padStart(2, '0')}T${String(9 + (i % 12)).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}:00Z`,
  };
});

export const activityLogsFixture = Array.from({ length: 50 }).map((_, i) => {
  const events = ['login', 'listing.view', 'listing.favorite', 'search', 'logout', 'signup'];
  return {
    id: `ac-${String(i + 1).padStart(5, '0')}`,
    user_id: `u-end-${String(1 + (i % 27)).padStart(2, '0')}`,
    event: events[i % events.length],
    payload: null,
    ip_address: `10.0.${i % 255}.${(i * 7) % 255}`,
    user_agent: 'Mozilla/5.0',
    created_at: `2026-04-${String(21 - (i % 20)).padStart(2, '0')}T${String(i % 24).padStart(2, '0')}:00:00Z`,
  };
});
