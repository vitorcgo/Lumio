'use client';

import { useEffect, useState } from 'react';

/** Aparece só depois de uma rolagem longa o bastante para o topo ficar longe. */
const THRESHOLD = 900;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setVisible((prev) => {
          const next = window.scrollY > THRESHOLD;
          return prev === next ? prev : next;
        });
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
      // Sobe acima do dock no celular; canto inferior direito no desktop.
      className={`fixed right-4 bottom-24 z-70 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-surface/90 text-white shadow-[0_12px_30px_rgba(0,0,0,.5)] backdrop-blur-md transition-[opacity,transform] duration-300 hover:border-amber/50 hover:text-amber-soft sm:right-6 lg:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
