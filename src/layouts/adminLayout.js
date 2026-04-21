/**
 * adminLayout — the master responsive shell. Responsive switching between
 * web (>= md) and mobile (< md) is pure Tailwind (`md:hidden`, `hidden md:flex`),
 * NOT JS media listeners.
 */
export function adminLayout() {
  return {
    init() {
      this._onFocus = (e) => {
        const tag = e.target?.tagName?.toLowerCase?.();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') {
          this.$store.ui.setBottomBarVisible(false);
        }
      };
      this._onBlur = () => this.$store.ui.setBottomBarVisible(true);
      document.addEventListener('focusin', this._onFocus);
      document.addEventListener('focusout', this._onBlur);
    },

    destroy() {
      document.removeEventListener('focusin', this._onFocus);
      document.removeEventListener('focusout', this._onBlur);
    },
  };
}
