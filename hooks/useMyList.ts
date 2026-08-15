'use client';

import { useMemo } from 'react';

import { pickMedia } from '@/lib/catalog';
import { useUserStore } from '@/lib/store';
import type { MediaView } from '@/lib/types';

export function useMyList(): {
  ids: number[];
  items: MediaView[];
  has: (id: number) => boolean;
  toggle: (id: number) => void;
} {
  const ids = useUserStore((s) => s.list);
  const toggle = useUserStore((s) => s.toggleList);
  const items = useMemo(() => pickMedia(ids), [ids]);

  return useMemo(
    () => ({ ids, items, has: (id: number) => ids.includes(id), toggle }),
    [ids, items, toggle],
  );
}
