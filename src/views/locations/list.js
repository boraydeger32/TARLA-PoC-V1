import { provincesObserver, districtsObserver } from '@/queries/locationsQueries.js';

export function locationsPage() {
  return {
    provinces: [],
    districts: [],
    selectedProvinceId: null,
    loadingP: true,
    loadingD: false,

    init() {
      this.$store.ui.activeModule = 'locations';
      this.pObs = provincesObserver();
      this.unsubP = this.pObs.subscribe((r) => {
        this.loadingP = r.isLoading;
        this.provinces = r.data?.items ?? [];
      });
    },
    destroy() {
      this.unsubP?.();
      this.unsubD?.();
    },

    selectProvince(id) {
      this.selectedProvinceId = id;
      this.unsubD?.();
      if (!id) { this.districts = []; return; }
      this.dObs = districtsObserver(id);
      this.unsubD = this.dObs.subscribe((r) => {
        this.loadingD = r.isLoading;
        this.districts = r.data?.items ?? [];
      });
    },
  };
}
