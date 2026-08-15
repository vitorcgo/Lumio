'use client';

import { useMemo } from 'react';

import { getMedia } from '@/lib/catalog';
import { useUserStore } from '@/lib/store';
import type { ContinueItem, MediaView } from '@/lib/types';

export interface ContinueEntry {
  entry: ContinueItem;
  media: MediaView;
  /** rota do player que retoma exatamente de onde parou */
  href: string;
  label: string;
}

export function watchHrefFor(entry: ContinueItem): string {
  return entry.kind === 'movie'
    ? `/watch/movie/${entry.id}`
    : `/watch/ep/${entry.id}/${entry.season}/${entry.n}`;
}

export function useContinueWatching(): {
  entries: ContinueEntry[];
  remove: (key: string) => void;
  restore: (entry: ContinueItem, index: number) => void;
} {
  const cont = useUserStore((s) => s.cont);
  const remove = useUserStore((s) => s.removeContinue);
  const restore = useUserStore((s) => s.restoreContinue);

  const entries = useMemo(
    () =>
      cont
        .map((entry): ContinueEntry | null => {
          const media = getMedia(entry.id);
          if (!media) return null;
          return {
            entry,
            media,
            href: watchHrefFor(entry),
            label:
              entry.kind === 'ep'
                ? `${media.title}: T${entry.season}:E${entry.n}`
                : media.title,
          };
        })
        .filter((x): x is ContinueEntry => x !== null),
    [cont],
  );

  return useMemo(() => ({ entries, remove, restore }), [entries, remove, restore]);
}
