import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/index.js';

/**
 * Browser-side MSW worker. Started from `main.js` BEFORE Alpine boots so
 * that the first API call always hits a registered handler.
 */
export const worker = setupWorker(...handlers);
