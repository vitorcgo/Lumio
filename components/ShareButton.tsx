'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ShareIcon } from './icons';

type Status = 'idle' | 'copied' | 'failed';

/** Compartilha o título pela API nativa; sem ela, copia o link. */
export function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const flash = useCallback((next: Status) => {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2200);
  }, []);

  const onClick = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} · Lumio`, url });
        return;
      } catch {
        // Compartilhamento cancelado ou indisponível: cai para a cópia do link.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash('copied');
    } catch {
      flash('failed');
    }
  }, [title, flash]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-white/14 bg-white/8 px-5 font-semibold text-white transition-colors hover:bg-white/14"
    >
      <ShareIcon className="h-[18px] w-[18px]" />
      <span aria-live="polite">
        {status === 'copied' ? 'Link copiado!' : status === 'failed' ? 'Copie da barra' : 'Compartilhar'}
      </span>
    </button>
  );
}
