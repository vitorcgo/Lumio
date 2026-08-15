'use client';

import { useMemo } from 'react';

import { useUserStore, type Preferences } from '@/lib/store';

export function usePreferences(): {
  prefs: Preferences;
  setPrefs: (patch: Partial<Preferences>) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
} {
  const prefs = useUserStore((s) => s.prefs);
  const setPrefs = useUserStore((s) => s.setPrefs);
  const setVolume = useUserStore((s) => s.setVolume);
  const toggleMute = useUserStore((s) => s.toggleMute);

  return useMemo(
    () => ({ prefs, setPrefs, setVolume, toggleMute }),
    [prefs, setPrefs, setVolume, toggleMute],
  );
}
