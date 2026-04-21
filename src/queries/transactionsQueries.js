import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { transactionsService } from '@/services/TransactionsService.js';

export function transactionsListObserver(params) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.transactions.list(params),
    queryFn: () => transactionsService.list(params),
  });
}

export function transactionDetailObserver(id) {
  return new QueryObserver(queryClient, {
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionsService.getById(id),
    enabled: !!id,
  });
}

export async function refundTransaction(id, reason) {
  const out = await transactionsService.refund(id, reason);
  queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
  return out;
}
