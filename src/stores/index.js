import { authStore } from './authStore.js';
import { themeStore } from './themeStore.js';
import { localeStore } from './localeStore.js';
import { uiStore } from './uiStore.js';

/**
 * Registers every Alpine store. Called once at app boot (before Alpine.start).
 * @param {import('alpinejs').Alpine} Alpine
 */
export function registerStores(Alpine) {
  Alpine.store('auth', authStore);
  Alpine.store('theme', themeStore);
  Alpine.store('locale', localeStore);
  Alpine.store('ui', uiStore);

  Alpine.store('theme').init();
  Alpine.store('locale').init();
  Alpine.store('auth').init?.();
}
