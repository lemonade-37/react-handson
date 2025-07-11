'use client';

import { useTransition } from 'react';
import { OptimisticPostsWrapperProps } from '../types';

export default function OptimisticPostsWrapper({ initialData, children }: OptimisticPostsWrapperProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={isPending ? 'transition-loading' : ''}>
      {children}
    </div>
  );
}
