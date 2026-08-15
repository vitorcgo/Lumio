'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** `true` quando o foco está num campo de texto: aí os atalhos não valem. */
function isTyping(el: Element | null): boolean {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    (el instanceof HTMLElement && el.isContentEditable)
  );
}

/**
 * Atalhos globais de navegação.
 *
 * O player registra os seus próprios (espaço, setas, F, M) na tela de reprodução.
 */
export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTyping(document.activeElement)) return;

      // "/" e "s" levam à busca: convenção de sites de catálogo.
      if (e.key === '/' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        router.push('/search');
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [router]);

  return null;
}
