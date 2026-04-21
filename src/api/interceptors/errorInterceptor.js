/**
 * Normalizes every non-2xx axios error into the project's `ApiError` shape:
 *   { code, message, fields? }
 *
 * FastAPI's two standard error forms are supported:
 *   - { "detail": "string" }
 *   - { "detail": [{ loc: [...], msg: "...", type: "..." }] }
 *
 * @param {import('axios').AxiosError} error
 */
export function errorInterceptor(error) {
  if (!error.response) {
    return Promise.reject({
      code: 'NETWORK',
      message: error.message ?? 'Network error',
    });
  }

  const { status, data } = error.response;
  const code = String(status);

  if (Array.isArray(data?.detail)) {
    /** @type {Record<string, string[]>} */
    const fields = {};
    for (const issue of data.detail) {
      const path = (issue.loc ?? []).filter((x) => x !== 'body').join('.') || '_root';
      (fields[path] ??= []).push(issue.msg);
    }
    return Promise.reject({
      code,
      message: 'validation_error',
      fields,
    });
  }

  const message =
    typeof data?.detail === 'string'
      ? data.detail
      : data?.message ?? `HTTP ${status}`;

  return Promise.reject({ code, message });
}
