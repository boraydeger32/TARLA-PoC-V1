/**
 * Thin wrapper around Vite's `?raw` import so page modules can declare
 * `const tpl = await loadHtml(() => import('@/views/foo.html?raw'))`.
 *
 * @param {() => Promise<{ default: string }>} importer
 * @returns {Promise<string>}
 */
export async function loadHtml(importer) {
  const mod = await importer();
  return mod.default;
}
