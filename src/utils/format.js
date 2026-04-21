import dayjs from 'dayjs';
import 'dayjs/locale/tr.js';

const TRY_FORMAT = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const NUMBER_FORMAT = new Intl.NumberFormat('tr-TR');

/** @param {number} value @param {string} [currency] */
export function formatPrice(value, currency = 'TRY') {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  if (currency === 'TRY') return TRY_FORMAT.format(value);
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(value);
}

/** @param {number} value */
export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  return NUMBER_FORMAT.format(value);
}

/** @param {number} sqm */
export function formatArea(sqm) {
  if (sqm === null || sqm === undefined) return '-';
  return `${NUMBER_FORMAT.format(sqm)} m²`;
}

/** @param {string|Date} value @param {string} [fmt] */
export function formatDate(value, fmt = 'DD.MM.YYYY') {
  if (!value) return '-';
  return dayjs(value).locale('tr').format(fmt);
}

/** @param {string|Date} value */
export function formatDateTime(value) {
  return formatDate(value, 'DD.MM.YYYY HH:mm');
}

/** @param {string|Date} value */
export function formatRelative(value) {
  if (!value) return '-';
  const d = dayjs(value);
  const diff = dayjs().diff(d, 'minute');
  if (diff < 1) return 'az önce';
  if (diff < 60) return `${diff} dk önce`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h} saat önce`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days} gün önce`;
  return formatDate(value);
}
