/**
 * Aperant Admin — bootstrap entry point.
 *
 * Order:
 *   1. MSW (conditional, must start BEFORE Alpine boots — see design.md §9)
 *   2. i18next
 *   3. Alpine stores + directives
 *   4. Router mount
 */
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import 'flowbite';
import 'gridjs/dist/theme/mermaid.min.css';
import './styles/main.css';

import { bootApp } from './app.js';
import { useMocks } from './utils/env.js';

async function enableMocks() {
  if (!useMocks()) return;
  try {
    const { worker } = await import('./mocks/browser.js');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    });
    console.info('[MSW] Mocking enabled');
  } catch (err) {
    console.error('[MSW] Failed to start mock worker', err);
  }
}

enableMocks().then(() => bootApp());
