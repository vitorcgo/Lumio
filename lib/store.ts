'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SEED_CONTINUE, SEED_WATCHED } from './data';
import { continueKey } from './format';
import type {
  AudioTrack,
  ContinueItem,
  Quality,
  Rating,
  Speed,
  StageSize,
  SubtitleLang,
} from './types';

export interface Preferences {
  subsOn: boolean;
  sub: SubtitleLang;
  audio: AudioTrack;
  quality: Quality;
  speed: Speed;
  /** 0–100 */
  volume: number;
  muted: boolean;
  size: StageSize;
}

const DEFAULT_PREFS: Preferences = {
  subsOn: true,
  sub: 'Português',
  audio: 'Dublado',
  quality: '4K',
  speed: '1x',
  volume: 80,
  muted: false,
  size: 'cinema',
};

interface UserState {
  /** `false` até o `localStorage` ser lido no cliente. */
  hydrated: boolean;
  list: number[];
  ratings: Record<number, Rating>;
  remind: number[];
  cont: ContinueItem[];
  history: string[];
  watched: number[];
  prefs: Preferences;

  toggleList: (id: number) => void;
  toggleRating: (id: number, value: Rating) => void;
  toggleRemind: (id: number) => void;

  touchContinue: (entry: Omit<ContinueItem, 'key'> & { key?: string }) => void;
  setContinueProgress: (key: string, progress: number) => void;
  removeContinue: (key: string) => void;
  /** Devolve um item removido à posição original: usado pelo "Desfazer". */
  restoreContinue: (entry: ContinueItem, index: number) => void;

  pushHistory: (query: string) => void;
  removeHistory: (query: string) => void;
  clearHistory: () => void;

  markWatched: (id: number) => void;

  setPrefs: (patch: Partial<Preferences>) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const MAX_HISTORY = 8;

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      hydrated: false,
      list: [],
      ratings: {},
      remind: [],
      cont: [...SEED_CONTINUE],
      history: [],
      watched: [...SEED_WATCHED],
      prefs: DEFAULT_PREFS,

      toggleList: (id) =>
        set((s) => ({
          list: s.list.includes(id) ? s.list.filter((x) => x !== id) : [...s.list, id],
        })),

      toggleRating: (id, value) =>
        set((s) => {
          const ratings = { ...s.ratings };
          if (ratings[id] === value) delete ratings[id];
          else ratings[id] = value;
          return { ratings };
        }),

      toggleRemind: (id) =>
        set((s) => ({
          remind: s.remind.includes(id) ? s.remind.filter((x) => x !== id) : [...s.remind, id],
        })),

      touchContinue: (entry) =>
        set((s) => {
          const key = entry.key ?? continueKey(entry.kind, entry.id, entry.season, entry.n);
          const prev = s.cont.find((e) => e.key === key);
          const rest = s.cont.filter((e) => e.key !== key);
          const merged: ContinueItem = {
            ...entry,
            key,
            progress: entry.progress || prev?.progress || 0,
          };
          return { cont: [merged, ...rest] };
        }),

      setContinueProgress: (key, progress) =>
        set((s) => {
          const rounded = Math.round(progress);
          let changed = false;
          const cont = s.cont.map((e) => {
            if (e.key !== key || e.progress === rounded) return e;
            changed = true;
            return { ...e, progress: rounded };
          });
          // Evita re-render quando o progresso arredondado não mudou.
          return changed ? { cont } : {};
        }),

      removeContinue: (key) => set((s) => ({ cont: s.cont.filter((e) => e.key !== key) })),

      restoreContinue: (entry, index) =>
        set((s) => {
          if (s.cont.some((e) => e.key === entry.key)) return {};
          const cont = [...s.cont];
          cont.splice(Math.max(0, Math.min(index, cont.length)), 0, entry);
          return { cont };
        }),

      pushHistory: (query) =>
        set((s) => {
          const q = query.trim();
          if (!q) return {};
          const history = [
            q,
            ...s.history.filter((x) => x.toLowerCase() !== q.toLowerCase()),
          ].slice(0, MAX_HISTORY);
          return { history };
        }),

      removeHistory: (query) => set((s) => ({ history: s.history.filter((x) => x !== query) })),

      clearHistory: () => set({ history: [] }),

      markWatched: (id) =>
        set((s) => (s.watched.includes(id) ? {} : { watched: [...s.watched, id] })),

      setPrefs: (patch) => set((s) => ({ prefs: { ...s.prefs, ...patch } })),

      setVolume: (volume) =>
        set((s) => {
          const v = Math.max(0, Math.min(100, Math.round(volume)));
          return { prefs: { ...s.prefs, volume: v, muted: v === 0 } };
        }),

      toggleMute: () => set((s) => ({ prefs: { ...s.prefs, muted: !s.prefs.muted } })),
    }),
    {
      name: 'lumio:user',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // A hidratação é disparada manualmente por <StoreHydrator/> depois da montagem,
      // para que o HTML do servidor e o primeiro render do cliente sejam idênticos.
      skipHydration: true,
      partialize: ({ list, ratings, remind, cont, history, watched, prefs }) => ({
        list,
        ratings,
        remind,
        cont,
        history,
        watched,
        prefs,
      }),
      // Dispara só quando <StoreHydrator/> chama `persist.rehydrate()`, bem depois
      // da inicialização do módulo: referenciar a própria store aqui é seguro.
      onRehydrateStorage: () => () => {
        useUserStore.setState({ hydrated: true });
      },
    },
  ),
);
