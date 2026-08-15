'use client';

import { useMemo } from 'react';

import { useUserStore } from '@/lib/store';

export function useSearchHistory(): {
  history: string[];
  push: (query: string) => void;
  remove: (query: string) => void;
  clear: () => void;
} {
  const history = useUserStore((s) => s.history);
  const push = useUserStore((s) => s.pushHistory);
  const remove = useUserStore((s) => s.removeHistory);
  const clear = useUserStore((s) => s.clearHistory);

  return useMemo(() => ({ history, push, remove, clear }), [history, push, remove, clear]);
}
