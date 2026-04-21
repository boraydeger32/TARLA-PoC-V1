/**
 * Generic "this page is not implemented yet" placeholder factory.
 * Used by module routes wired up before the module's real content lands.
 *
 * Usage:
 *   <div x-data="placeholderPage" x-init="title='listings.list.title'">
 *     <h1 x-t="title"></h1>
 *   </div>
 */
export function placeholderPage() {
  return {
    title: 'common.coming_soon',
  };
}
