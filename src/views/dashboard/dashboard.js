import { dashboardStatsObserver, dashboardTrendObserver } from '@/queries/dashboardQueries.js';
import { listingsListObserver } from '@/queries/listingsQueries.js';
import { categoriesListObserver } from '@/queries/categoriesQueries.js';
import { formatNumber, formatPrice, formatRelative } from '@/utils/format.js';
import { t } from '@/i18n/index.js';

function chartBaseOptions() {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: isDark ? '#cbd5e1' : '#475569',
      fontFamily: 'inherit',
    },
    grid: { borderColor: isDark ? '#334155' : '#e2e8f0' },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    dataLabels: { enabled: false },
  };
}

export function dashboardPage() {
  return {
    stats: null,
    loadingStats: true,
    recentActivity: [],
    categories: [],
    listingsAll: [],
    charts: { listings: null, users: null, categories: null, revenue: null },
    unsubs: [],

    init() {
      this.$store.ui.activeModule = 'dashboard';

      const statsObs = dashboardStatsObserver();
      this.unsubs.push(
        statsObs.subscribe((r) => {
          this.loadingStats = r.isLoading;
          this.stats = r.data ?? null;
          this.recentActivity = r.data?.recent_activity ?? [];
        }),
      );

      const listingsTrendObs = dashboardTrendObserver('listings', 30);
      this.unsubs.push(
        listingsTrendObs.subscribe((r) => {
          if (r.data?.series) this.renderListingsTrend(r.data.series);
        }),
      );

      const usersTrendObs = dashboardTrendObserver('users', 30);
      this.unsubs.push(
        usersTrendObs.subscribe((r) => {
          if (r.data?.series) this.renderUsersTrend(r.data.series);
        }),
      );

      const revenueTrendObs = dashboardTrendObserver('revenue', 365);
      this.unsubs.push(
        revenueTrendObs.subscribe((r) => {
          if (r.data?.series) this.renderRevenueTrend(r.data.series);
        }),
      );

      const catObs = categoriesListObserver({ size: 100 });
      this.unsubs.push(
        catObs.subscribe((r) => {
          this.categories = r.data?.items ?? [];
          this.tryRenderCategoryDistribution();
        }),
      );

      const lstObs = listingsListObserver({ page: 1, size: 200 });
      this.unsubs.push(
        lstObs.subscribe((r) => {
          this.listingsAll = r.data?.items ?? [];
          this.tryRenderCategoryDistribution();
        }),
      );
    },

    destroy() {
      this.unsubs.forEach((u) => u?.());
      Object.values(this.charts).forEach((c) => c?.destroy?.());
    },

    formatNumber,
    formatPrice,
    formatRelative,

    activityLabel(action) {
      return t(`dashboard.activity.${action}`, { defaultValue: action });
    },

    pendingLink() {
      window.history.pushState({}, '', '/admin/listings?status=pending_approval');
      window.dispatchEvent(new PopStateEvent('popstate'));
    },

    async renderListingsTrend(series) {
      const ApexCharts = (await import('apexcharts')).default;
      const el = this.$refs.chartListings;
      if (!el) return;
      this.charts.listings?.destroy?.();
      this.charts.listings = new ApexCharts(el, {
        ...chartBaseOptions(),
        chart: { ...chartBaseOptions().chart, type: 'area', height: 260 },
        series: [{ name: t('dashboard.charts.listings_trend'), data: series.map((p) => p.value) }],
        xaxis: { categories: series.map((p) => p.date), labels: { rotate: -45, style: { fontSize: '10px' } } },
        colors: ['#2563eb'],
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
      });
      this.charts.listings.render();
    },

    async renderUsersTrend(series) {
      const ApexCharts = (await import('apexcharts')).default;
      const el = this.$refs.chartUsers;
      if (!el) return;
      this.charts.users?.destroy?.();
      this.charts.users = new ApexCharts(el, {
        ...chartBaseOptions(),
        chart: { ...chartBaseOptions().chart, type: 'bar', height: 260 },
        series: [{ name: t('dashboard.charts.users_per_day'), data: series.map((p) => p.value) }],
        xaxis: { categories: series.map((p) => p.date), labels: { rotate: -45, style: { fontSize: '10px' } } },
        colors: ['#16a34a'],
        plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
      });
      this.charts.users.render();
    },

    async renderRevenueTrend(series) {
      const ApexCharts = (await import('apexcharts')).default;
      const el = this.$refs.chartRevenue;
      if (!el) return;
      this.charts.revenue?.destroy?.();
      const monthly = aggregateByMonth(series);
      this.charts.revenue = new ApexCharts(el, {
        ...chartBaseOptions(),
        chart: { ...chartBaseOptions().chart, type: 'line', height: 260 },
        series: [{ name: t('dashboard.charts.revenue_trend'), data: monthly.map((p) => p.value) }],
        xaxis: { categories: monthly.map((p) => p.label) },
        colors: ['#f59e0b'],
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 4 },
      });
      this.charts.revenue.render();
    },

    async tryRenderCategoryDistribution() {
      if (!this.categories.length || !this.listingsAll.length) return;
      const counts = {};
      for (const l of this.listingsAll) {
        counts[l.category_id] = (counts[l.category_id] ?? 0) + 1;
      }
      const labels = [];
      const values = [];
      for (const c of this.categories) {
        const v = counts[c.id] ?? 0;
        if (v > 0) {
          labels.push(c.name_tr);
          values.push(v);
        }
      }
      const ApexCharts = (await import('apexcharts')).default;
      const el = this.$refs.chartCategories;
      if (!el) return;
      this.charts.categories?.destroy?.();
      this.charts.categories = new ApexCharts(el, {
        ...chartBaseOptions(),
        chart: { ...chartBaseOptions().chart, type: 'donut', height: 260 },
        series: values,
        labels,
        colors: ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'],
        legend: { position: 'bottom' },
      });
      this.charts.categories.render();
    },
  };
}

function aggregateByMonth(series) {
  const buckets = new Map();
  for (const p of series) {
    const key = p.date.slice(0, 7);
    buckets.set(key, (buckets.get(key) ?? 0) + p.value);
  }
  return Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
}
