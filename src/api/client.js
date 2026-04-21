import axios from 'axios';

import { authInterceptor } from './interceptors/authInterceptor.js';
import { refreshInterceptor } from './interceptors/refreshInterceptor.js';
import { errorInterceptor } from './interceptors/errorInterceptor.js';
import { apiBaseUrl } from '@/utils/env.js';

/**
 * Singleton wrapper around an axios instance. Every service uses this — the
 * services layer is the ONLY layer in the codebase allowed to import axios,
 * which is what makes the MSW ↔ FastAPI swap transparent.
 *
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 * @typedef {import('axios').AxiosRequestConfig} AxiosRequestConfig
 */
export class ApiClient {
  static #instance = null;

  /** @type {AxiosInstance} */
  axios;

  constructor() {
    if (ApiClient.#instance) {
      throw new Error('Use ApiClient.getInstance()');
    }
    this.axios = axios.create({
      baseURL: apiBaseUrl(),
      timeout: 15_000,
      headers: { 'Content-Type': 'application/json' },
    });
    this.#applyInterceptors();
  }

  static getInstance() {
    if (!ApiClient.#instance) {
      ApiClient.#instance = new ApiClient();
    }
    return ApiClient.#instance;
  }

  /** Test-only — drops the cached instance so each test gets a fresh one. */
  static _reset() {
    ApiClient.#instance = null;
  }

  #applyInterceptors() {
    this.axios.interceptors.request.use(authInterceptor);
    this.axios.interceptors.response.use((r) => r, refreshInterceptor);
    this.axios.interceptors.response.use((r) => r, errorInterceptor);
  }

  /** @template T @param {string} url @param {AxiosRequestConfig} [config] @returns {Promise<T>} */
  get(url, config) {
    return this.axios.get(url, config).then((r) => r.data);
  }

  /** @template T @param {string} url @param {unknown} [body] @param {AxiosRequestConfig} [config] @returns {Promise<T>} */
  post(url, body, config) {
    return this.axios.post(url, body, config).then((r) => r.data);
  }

  put(url, body, config) {
    return this.axios.put(url, body, config).then((r) => r.data);
  }

  patch(url, body, config) {
    return this.axios.patch(url, body, config).then((r) => r.data);
  }

  delete(url, config) {
    return this.axios.delete(url, config).then((r) => r.data);
  }
}

export const apiClient = ApiClient.getInstance();
