import i18next from 'i18next';

/**
 * Registers the `x-t` directive. Usage:
 *   <h1 x-t="'listings.list.title'"></h1>
 *   <span x-t="'users.greeting'"  x-t:data='{ name: user.name }'></span>
 *
 * The directive re-evaluates whenever the expression changes OR when
 * `i18next.languageChanged` fires.
 *
 * @param {import('alpinejs').Alpine} Alpine
 */
export function registerI18nDirective(Alpine) {
  Alpine.magic('t', () => (key, opts) => i18next.t(key, opts));

  Alpine.directive('t', (el, { expression }, { evaluateLater, effect, cleanup }) => {
    const getKey = evaluateLater(expression);
    const render = () => {
      getKey((key) => {
        if (!key) return;
        el.textContent = i18next.t(key);
      });
    };

    effect(render);

    const onLang = () => render();
    i18next.on('languageChanged', onLang);
    cleanup(() => i18next.off('languageChanged', onLang));
  });
}
