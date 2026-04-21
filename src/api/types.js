/**
 * Shared API typedefs. Consumed via JSDoc across the codebase.
 *
 * @typedef {object} ApiError
 * @property {string} code        - machine-readable code (HTTP status or 'NETWORK' / 'UNKNOWN')
 * @property {string} message     - translated or raw message
 * @property {Record<string, string[]>} [fields] - field-level validation errors (FastAPI 422)
 *
 * @typedef {object} PaginatedResponse
 * @property {unknown[]} items
 * @property {number} total
 * @property {number} page
 * @property {number} size
 * @property {number} pages
 *
 * @typedef {object} FastApiValidationIssue
 * @property {Array<string|number>} loc
 * @property {string} msg
 * @property {string} type
 */
export {};
