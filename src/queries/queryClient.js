import { QueryClient } from '@tanstack/query-core';

/**
 * Singleton `QueryClient`. All observers and mutations in the project share
 * this cache. Default options balance freshness vs chatter.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
