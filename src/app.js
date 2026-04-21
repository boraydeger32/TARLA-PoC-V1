/**
 * Top-level application bootstrap. Invoked from `main.js` AFTER MSW boot.
 *
 * Responsibilities (wired incrementally across tasks):
 *   - Task 2: initialize i18next, register stores + `x-t` directive
 *   - Task 5: finalize auth flow
 *   - Task 6: mount router with all routes
 *   - Task 7+: register per-module Alpine components
 */
import Alpine from 'alpinejs';

import { initI18n } from './i18n/index.js';
import { registerI18nDirective } from './i18n/alpineDirective.js';
import { registerStores } from './stores/index.js';
import { registerAlpineComponents } from './views/registerComponents.js';
import { startRouter } from './router/index.js';

export async function bootApp() {
  await initI18n();

  registerStores(Alpine);
  registerI18nDirective(Alpine);
  registerAlpineComponents(Alpine);

  window.Alpine = Alpine;
  Alpine.start();

  startRouter();
}
