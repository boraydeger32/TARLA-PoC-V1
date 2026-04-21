/**
 * Aperant color palette tokens — consumed by tailwind.config.js.
 *
 * Template scales follow Tailwind's shade convention (50..950). Dark-mode
 * variants are reached via the `dark:` prefix on the *same token* (resolved
 * by the `darkMode: 'class'` strategy) — we do NOT maintain a parallel
 * `primary-dark` palette. Instead, `surface`, `background`, etc. have a
 * dedicated `-dark` suffixed variant so layouts can opt in explicitly.
 */
export const colors = Object.freeze({
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#1976d2',
    600: '#1565c0',
    700: '#0d47a1',
    800: '#0a3a85',
    900: '#072c65',
    DEFAULT: '#1976d2',
  },
  secondary: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffa000',
    600: '#ff8f00',
    700: '#ff6f00',
    800: '#e65100',
    900: '#bf360c',
    DEFAULT: '#ffa000',
  },
  success: { DEFAULT: '#16a34a', 500: '#22c55e', 600: '#16a34a' },
  warning: { DEFAULT: '#f59e0b', 500: '#f59e0b', 600: '#d97706' },
  danger: { DEFAULT: '#dc2626', 500: '#ef4444', 600: '#dc2626' },
  info: { DEFAULT: '#0284c7', 500: '#0ea5e9', 600: '#0284c7' },
  surface: {
    DEFAULT: '#ffffff',
    soft: '#f8fafc',
    dark: '#1a2029',
    'dark-soft': '#141b24',
  },
  background: {
    DEFAULT: '#f5f7fa',
    dark: '#0f1419',
  },
});
