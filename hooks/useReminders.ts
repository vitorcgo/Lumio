'use client';

import { useMemo } from 'react';

import { useUserStore } from '@/lib/store';

export function useReminders(): {
  remind: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => void;
} {
  const remind = useUserStore((s) => s.remind);
  const toggle = useUserStore((s) => s.toggleRemind);

  return useMemo(
    () => ({ remind, has: (id: number) => remind.includes(id), toggle }),
    [remind, toggle],
  );
}
