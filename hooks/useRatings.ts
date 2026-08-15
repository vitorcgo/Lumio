'use client';

import { useMemo } from 'react';

import { useUserStore } from '@/lib/store';
import type { Rating } from '@/lib/types';

export function useRatings(): {
  ratings: Record<number, Rating>;
  liked: number[];
  disliked: number[];
  ratingOf: (id: number) => Rating | undefined;
  toggle: (id: number, value: Rating) => void;
} {
  const ratings = useUserStore((s) => s.ratings);
  const toggle = useUserStore((s) => s.toggleRating);

  return useMemo(() => {
    const entries = Object.entries(ratings);
    const liked = entries.filter(([, v]) => v === 'up').map(([k]) => Number(k));
    const disliked = entries.filter(([, v]) => v === 'down').map(([k]) => Number(k));
    return {
      ratings,
      liked,
      disliked,
      ratingOf: (id: number) => ratings[id],
      toggle,
    };
  }, [ratings, toggle]);
}
