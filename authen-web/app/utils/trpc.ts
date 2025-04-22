'use client';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../packages/trpc-types';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
});
