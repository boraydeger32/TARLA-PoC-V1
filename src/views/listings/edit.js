import { listingDetailObserver } from '@/queries/listingsQueries.js';
import { categoriesListObserver } from '@/queries/categoriesQueries.js';
import { listingFormController } from '@/controllers/listingFormController.js';
import { router } from '@/router/index.js';

const ZONING = ['imarli', 'imarsiz', 'koy_yerlesik', 'ihtilafli', 'tarim'];
const CURRENCIES = ['TRY', 'USD', 'EUR'];

function getRouteSource() {
  return window.location.hash || window.location.pathname;
}

function getRouteId() {
  const m = getRouteSource().match(/\/admin\/listings\/([^/]+)\/edit$/);
  return m ? m[1] : null;
}

export function listingEditPage() {
  const id = getRouteId();
  const isCreate = !id || getRouteSource().endsWith('/listings/new');
  const controller = listingFormController({ mode: isCreate ? 'create' : 'update' });

  return {
    ...controller,
    id,
    isCreate,
    zoningOptions: ZONING,
    currencyOptions: CURRENCIES,
    categories: [],

    init() {
      this.$store.ui.activeModule = 'listings';
      this.catObserver = categoriesListObserver({ size: 100 });
      this.unsubCats = this.catObserver.subscribe((res) => {
        this.categories = res.data?.items ?? [];
      });
      if (!this.isCreate && this.id) {
        this.detailObserver = listingDetailObserver(this.id);
        this.unsubDetail = this.detailObserver.subscribe((res) => {
          if (res.data) this.setInitial(res.data);
        });
      }
    },
    destroy() {
      this.unsubCats?.();
      this.unsubDetail?.();
    },

    async onSubmit() {
      const out = await this.submit(this.id);
      if (out) {
        router.navigate(`/admin/listings/${out.id ?? this.id}`);
      }
    },
    cancel() {
      if (this.id && !this.isCreate) router.navigate(`/admin/listings/${this.id}`);
      else router.navigate('/admin/listings');
    },
  };
}
