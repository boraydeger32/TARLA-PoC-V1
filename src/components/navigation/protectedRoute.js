import Alpine from 'alpinejs';

import { ADMIN_ROLES } from '@/constants/roles.js';
import { PATHS } from '@/router/paths.js';

/**
 * Route guard factory. Wraps a Navigo handler; when the user is not logged in
 * it redirects to `/login`, and when the user lacks any admin role it
 * redirects to `/403`.
 *
 * Optionally accepts a second argument describing the required roles for this
 * specific route (fine-grained RBAC beyond the default "any admin" check).
 *
 * @param {(match: unknown) => unknown} handler
 * @param {string[]} [requiredRoles]
 */
export function protectedRoute(handler, requiredRoles) {
  return (match) => {
    const auth = Alpine.store('auth');
    if (!auth?.isAuthenticated?.()) {
      window.location.hash = `#${PATHS.LOGIN}`;
      return;
    }

    const role = auth.user?.role;
    if (!ADMIN_ROLES.includes(role)) {
      window.location.hash = `#${PATHS.FORBIDDEN}`;
      return;
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      window.location.hash = `#${PATHS.FORBIDDEN}`;
      return;
    }

    return handler(match);
  };
}
