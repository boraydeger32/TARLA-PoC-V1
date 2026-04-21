/**
 * uiStore — transient UI state (drawer open, sidebar collapsed, active module).
 * NEVER store API data here (see CLAUDE.md Rule 6).
 */
export const uiStore = {
  sidebarRailExpanded: true,
  sidebarPanelOpen: false,
  /** @type {string|null} */
  activeModule: null,
  mobileDrawerOpen: false,
  globalLoading: false,
  bottomBarVisible: true,
  /** @type {Array<{ id: string, type: 'success'|'error'|'info'|'warning', message: string }>} */
  toasts: [],

  toggleSidebarPanel() {
    this.sidebarPanelOpen = !this.sidebarPanelOpen;
  },

  /** @param {string} name */
  openModule(name) {
    this.activeModule = name;
    this.sidebarPanelOpen = true;
  },

  closeSidebarPanel() {
    this.sidebarPanelOpen = false;
  },

  openDrawer() {
    this.mobileDrawerOpen = true;
  },

  closeDrawer() {
    this.mobileDrawerOpen = false;
  },

  /** @param {boolean} v */
  setBottomBarVisible(v) {
    this.bottomBarVisible = v;
  },

  /**
   * @param {'success'|'error'|'info'|'warning'} type
   * @param {string} message
   */
  pushToast(type, message) {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.toasts.push({ id, type, message });
    setTimeout(() => this.dismissToast(id), 4_000);
  },

  /** @param {string} id */
  dismissToast(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  },
};
