'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LumioLogo, LumioWordmark, PlayGlyph } from './Brand';
import { Particles } from './Particles';
import { CATALOG } from '@/lib/catalog';
import { tileGradient } from '@/lib/format';

const SESSION_KEY = 'lumio:splash';

/** A abertura sai sozinha; o botão é só o atalho para quem não quer esperar. */
const AUTO_DISMISS_MS = 3200;

/** Fita de pôsteres do rodapé: um conjunto curto, duplicado para o loop. */
const STRIP = CATALOG.slice(0, 14);

/**
 * Abertura de marca. Aparece uma vez por sessão e é montada só depois da
 * hidratação: o servidor nunca a renderiza, então não há divergência de HTML.
 */
export function Splash() {
  const [visible, setVisible] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    } catch {
      // sessionStorage bloqueado (modo privado): mostra a abertura mesmo assim.
    }
    setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // sem persistência: a abertura volta na próxima navegação, sem quebrar nada.
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    ctaRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      clearTimeout(timer);
    };
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bem-vindo à Lumio"
      className="fixed inset-0 z-80 flex flex-col overflow-hidden bg-ink"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[38%] left-1/2 h-[520px] w-[520px] rounded-full blur-[20px] motion-safe:animate-glow sm:h-[720px] sm:w-[720px]"
        style={{
          background:
            'radial-gradient(circle,rgba(255,200,26,.5),rgba(255,160,20,.12) 45%,transparent 70%)',
          transform: 'translate(-50%,-50%)',
        }}
      />

      <Particles />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex items-center gap-3.5 motion-safe:animate-rise sm:gap-[18px]">
          <LumioLogo size={54} className="sm:hidden" />
          <LumioLogo size={70} className="hidden sm:grid" />
          <LumioWordmark className="text-[44px] leading-none sm:text-[64px]" />
        </div>

        <p
          className="mt-6 max-w-[660px] font-display text-[21px] font-semibold text-balance motion-safe:animate-rise sm:mt-[26px] sm:text-[27px]"
          style={{ animationDelay: '.08s' }}
        >
          Filmes, séries, animes e TV ao vivo.
          <br />
          Um só lugar, sem limites.
        </p>

        <p
          className="mt-3.5 max-w-[470px] text-[15px] text-pretty text-white/55 motion-safe:animate-rise sm:text-[16px]"
          style={{ animationDelay: '.16s' }}
        >
          Milhares de títulos em 4K e canais ao vivo. Assista onde quiser, quando quiser. A próxima
          maratona começa agora.
        </p>

        <button
          ref={ctaRef}
          type="button"
          onClick={dismiss}
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-amber-hi to-amber-mid px-8 py-4 font-display text-[16px] font-bold text-night shadow-[0_12px_34px_rgba(255,190,26,.45)] transition-transform motion-safe:animate-rise hover:scale-[1.03] sm:mt-[34px] sm:px-[34px] sm:text-[17px] motion-reduce:hover:scale-100"
          style={{ animationDelay: '.24s' }}
        >
          <PlayGlyph />
          Começar a assistir
        </button>

        {/* Barra que mostra quanto falta para a abertura sair sozinha. */}
        <div
          aria-hidden="true"
          className="mt-7 h-[3px] w-[180px] overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full origin-left rounded-full bg-gradient-to-r from-amber-hi to-amber-mid"
            style={{ animation: `luProgress ${AUTO_DISMISS_MS}ms linear forwards` }}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative h-[130px] overflow-hidden opacity-60 sm:h-[190px]"
        style={{
          maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)',
          WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)',
        }}
      >
        <div className="flex w-max gap-4 px-5 motion-safe:animate-marquee">
          {[...STRIP, ...STRIP].map((media, i) => (
            <div
              key={`${media.id}-${i}`}
              className="relative h-[118px] w-[82px] shrink-0 overflow-hidden rounded-xl sm:h-[170px] sm:w-[118px]"
              style={{ backgroundImage: tileGradient(media.hue) }}
            >
              {media.img ? (
                <Image
                  src={media.img}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="118px"
                  className="object-cover"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
