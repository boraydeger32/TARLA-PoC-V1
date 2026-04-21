import { QueryObserver } from '@tanstack/query-core';
import { queryClient } from './queryClient.js';
import { queryKeys } from './queryKeys.js';
import { bannersService, faqsService, blogService } from '@/services/ContentService.js';

function listObserver(svc, keyFn, params) {
  return new QueryObserver(queryClient, {
    queryKey: keyFn(params),
    queryFn: () => svc.list(params),
  });
}

export const bannersListObserver = (p) => listObserver(bannersService, queryKeys.content.banners.list, p);
export const faqsListObserver = (p) => listObserver(faqsService, queryKeys.content.faqs.list, p);
export const blogListObserver = (p) => listObserver(blogService, queryKeys.content.blog.list, p);

function mkMutations(svc, allKey) {
  const inv = () => queryClient.invalidateQueries({ queryKey: allKey });
  return {
    create: async (dto) => { const r = await svc.create(dto); inv(); return r; },
    update: async (id, dto) => { const r = await svc.update(id, dto); inv(); return r; },
    delete: async (id) => { const r = await svc.delete(id); inv(); return r; },
  };
}

export const bannersMutations = mkMutations(bannersService, queryKeys.content.banners.all);
export const faqsMutations = {
  ...mkMutations(faqsService, queryKeys.content.faqs.all),
  reorder: async (ids) => {
    const r = await faqsService.reorder(ids);
    queryClient.invalidateQueries({ queryKey: queryKeys.content.faqs.all });
    return r;
  },
};
export const blogMutations = {
  ...mkMutations(blogService, queryKeys.content.blog.all),
  publish: async (id) => {
    const r = await blogService.publish(id);
    queryClient.invalidateQueries({ queryKey: queryKeys.content.blog.all });
    return r;
  },
  unpublish: async (id) => {
    const r = await blogService.unpublish(id);
    queryClient.invalidateQueries({ queryKey: queryKeys.content.blog.all });
    return r;
  },
};
