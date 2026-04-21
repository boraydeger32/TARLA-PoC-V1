export const LISTING_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
});

export const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  BANNED: 'banned',
  PENDING_VERIFICATION: 'pending_verification',
});

export const TRANSACTION_STATUS = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
  FAILED: 'failed',
});

export const ZONING_STATUS = Object.freeze({
  IMARLI: 'imarli',
  IMARSIZ: 'imarsiz',
  KOY_YERLESIK: 'koy_yerlesik',
  IHTILAFLI: 'ihtilafli',
  TARIM: 'tarim',
});

export const REPORT_STATUS = Object.freeze({
  PENDING: 'pending',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
});
