/**
 * Role matrix — consumed by `protectedRoute()` and by per-page action
 * visibility toggles (e.g. "only super_admin can ban users").
 * Keep synchronized with the backend `Role` enum (Pydantic) in Phase 2.
 */
export const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  CONTENT_MANAGER: 'content_manager',
  END_USER: 'end_user',
});

/** Roles that may access the admin panel at all. */
export const ADMIN_ROLES = Object.freeze([
  ROLES.SUPER_ADMIN,
  ROLES.MODERATOR,
  ROLES.CONTENT_MANAGER,
]);

/**
 * Feature-level permission matrix. Each entry maps an action to the roles
 * allowed to perform it. Consumed by components that render actionable UI.
 */
export const PERMISSIONS = Object.freeze({
  LISTING_APPROVE: [ROLES.SUPER_ADMIN, ROLES.MODERATOR],
  LISTING_REJECT: [ROLES.SUPER_ADMIN, ROLES.MODERATOR],
  LISTING_FEATURE: [ROLES.SUPER_ADMIN, ROLES.MODERATOR],
  LISTING_DELETE: [ROLES.SUPER_ADMIN],
  LISTING_CREATE: [ROLES.SUPER_ADMIN, ROLES.MODERATOR, ROLES.CONTENT_MANAGER],
  USER_BAN: [ROLES.SUPER_ADMIN, ROLES.MODERATOR],
  USER_ROLE_CHANGE: [ROLES.SUPER_ADMIN],
  USER_DELETE: [ROLES.SUPER_ADMIN],
  CATEGORY_WRITE: [ROLES.SUPER_ADMIN, ROLES.CONTENT_MANAGER],
  CONTENT_WRITE: [ROLES.SUPER_ADMIN, ROLES.CONTENT_MANAGER],
  PACKAGE_WRITE: [ROLES.SUPER_ADMIN],
  SETTINGS_WRITE: [ROLES.SUPER_ADMIN],
});

/**
 * @param {string|null|undefined} role
 * @param {keyof typeof PERMISSIONS} action
 * @returns {boolean}
 */
export function canPerform(role, action) {
  if (!role) return false;
  const allowed = PERMISSIONS[action];
  return Array.isArray(allowed) && allowed.includes(role);
}
