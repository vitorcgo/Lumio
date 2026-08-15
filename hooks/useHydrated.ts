'use client';

import { useUserStore } from '@/lib/store';

/**
 * `true` depois que o estado do usuário foi lido do `localStorage`.
 * Enquanto for `false`, o que está na tela é o estado padrão: igual ao HTML do servidor.
 */
export function useHydrated(): boolean {
  return useUserStore((s) => s.hydrated);
}
