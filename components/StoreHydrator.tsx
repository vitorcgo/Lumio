'use client';

import { useEffect } from 'react';

import { useUserStore } from '@/lib/store';

/**
 * Lê o estado do usuário do `localStorage` depois da montagem.
 *
 * A store é criada com `skipHydration`, então o HTML do servidor e o primeiro
 * render do cliente usam os mesmos valores padrão: nada de aviso de hidratação.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useUserStore.persist.rehydrate();
  }, []);

  return null;
}
