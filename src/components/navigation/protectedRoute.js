import Alpine from 'alpinejs';

import { ADMIN_ROLES } from '@/constants/roles.js';
import { PATHS, withBase } from '@/router/paths.js';

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
      return window.location.replace(withBase(PATHS.LOGIN));
    }

    const role = auth.user?.role;
    if (!ADMIN_ROLES.includes(role)) {
      return window.location.replace(withBase(PATHS.FORBIDDEN));
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      return window.location.replace(withBase(PATHS.FORBIDDEN));
    }

    return handler(match);
  };
}
