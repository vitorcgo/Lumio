'use client';

import { useEffect } from 'react';

import { CloseIcon } from './icons';
import { useToastStore, type Toast } from '@/lib/toast';

const LIFETIME_MS = 6000;

function ToastRow({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const id = setTimeout(() => dismiss(toast.id), LIFETIME_MS);
    return () => clearTimeout(id);
  }, [toast.id, dismiss]);

  return (
    <li className="pointer-events-auto flex items-center gap-3 rounded-xl border border-white/12 bg-surface/95 py-2.5 pr-2.5 pl-4 shadow-[0_18px_44px_rgba(0,0,0,.6)] backdrop-blur-md motion-safe:animate-pop">
      <span className="flex-1 text-sm text-white/90">{toast.message}</span>

      {toast.action ? (
        <button
          type="button"
          onClick={() => {
            toast.action?.run();
            dismiss(toast.id);
          }}
          className="rounded-lg px-2.5 py-1.5 text-sm font-bold text-amber-soft transition-colors hover:bg-amber/15"
        >
          {toast.action.label}
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dispensar aviso"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}

/**
 * Avisos curtos de confirmação. Ficam acima do dock no celular e no canto
 * inferior esquerdo no desktop, sem bloquear nada: `pointer-events` só nos itens.
 */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <ul
      aria-live="polite"
      aria-label="Avisos"
      // `mr-14` no celular: o botão "voltar ao topo" mora no mesmo canto, e sem isso
      // ele cobria justamente o "Desfazer".
      className="pointer-events-none fixed inset-x-4 bottom-24 z-70 mr-14 flex flex-col gap-2 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:mr-0 sm:w-[360px] lg:bottom-6"
    >
      {toasts.map((t) => (
        <ToastRow key={t.id} toast={t} />
      ))}
    </ul>
  );
}
