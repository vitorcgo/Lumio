'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Particles } from './Particles';
import { InfoIcon, PlayIcon, StarIcon } from './icons';
import { playHrefFor } from '@/lib/catalog';
import { backdropGradient } from '@/lib/format';
import type { MediaView } from '@/lib/types';

const SLIDE_MS = 7000;

/**
 * Hero em carrossel: alterna sozinho entre os destaques, trocando a arte de
 * fundo e o texto juntos. A primeira arte carrega com `priority` porque é o LCP
 * da Home; as demais entram sob demanda.
 */
export function Hero({ items }: { items: MediaView[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const total = items.length;

  // Quem prefere menos movimento não recebe troca automática.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused || reduced || total < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % total), SLIDE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, reduced, total]);

  const active = items[index];
  if (!active) return null;

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      // No celular a altura segue o conteúdo (com um piso), senão o título era
      // empurrado para cima e cortado pela barra fixa. Só no desktop volta a ser vh.
      className="relative -mt-16 flex min-h-[600px] flex-col overflow-hidden lg:-mt-[76px] lg:h-[82vh] lg:min-h-[620px]"
    >
      {/* Camadas de arte empilhadas: só a ativa fica opaca. */}
      {items.map((media, i) => (
        <div
          key={media.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: backdropGradient(media.hue) }}
        >
          {media.img ? (
            <div className={i === index ? 'absolute inset-0 motion-safe:animate-ken' : 'absolute inset-0'}>
              <Image
                src={media.img}
                alt=""
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : 'lazy'}
                sizes="100vw"
                className="object-cover object-[center_16%]"
              />
            </div>
          ) : null}
        </div>
      ))}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-night via-night/78 via-45% to-night/30 lg:bg-gradient-to-r lg:from-night/97 lg:via-night/72 lg:via-40% lg:to-night/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night lg:h-[220px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-70 blur-[60px] lg:left-1/4 lg:h-[680px] lg:w-[680px]"
        style={{ background: 'radial-gradient(circle, rgba(255,190,26,.16), transparent 68%)' }}
      />
      <Particles count={14} />

      <div className="relative flex flex-1 flex-col justify-end px-5 pt-24 pb-10 sm:px-6 lg:px-10 lg:pt-28 lg:pb-20">
        {/* A key remonta o bloco a cada troca, refazendo a animação de entrada. */}
        <div key={active.id} className="max-w-[620px] motion-safe:animate-rise">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/14 px-3 py-1 text-[11px] font-bold tracking-[.14em] text-amber-soft uppercase backdrop-blur-sm">
            {active.typeLabel} · {active.genre}
          </p>

          <h1 className="font-display text-[30px] leading-[1.06] font-bold -tracking-[.02em] text-balance [text-shadow:0_4px_30px_rgba(0,0,0,.6)] sm:text-[44px] lg:text-[62px]">
            {active.title}
          </h1>

          <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-medium text-white/80 sm:text-[15px]">
            <span className="inline-flex items-center gap-1 font-bold text-amber">
              <StarIcon className="h-3.5 w-3.5" />
              {active.ratingText}
            </span>
            <span aria-hidden="true" className="text-white/35">
              •
            </span>
            <span>{active.year}</span>
            <span aria-hidden="true" className="text-white/35">
              •
            </span>
            <span>{active.durText}</span>
          </p>

          {/* Três linhas bastam no celular; o texto inteiro está na ficha do título. */}
          <p className="mt-3.5 line-clamp-3 max-w-[520px] text-[15px] leading-relaxed text-pretty text-white/74 sm:line-clamp-none sm:text-[16px]">
            {active.synopsis}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={playHrefFor(active)}
              className="inline-flex h-[52px] items-center gap-2.5 rounded-xl bg-gradient-to-br from-amber-hi to-amber-mid px-7 font-display text-[15px] font-bold text-night shadow-[0_12px_30px_rgba(255,190,26,.4)] transition-transform hover:scale-[1.03] sm:px-8 sm:text-[16px] motion-reduce:hover:scale-100"
            >
              <PlayIcon className="h-[18px] w-[18px]" />
              Assistir
            </Link>
            <Link
              href={`/title/${active.id}`}
              className="inline-flex h-[52px] items-center gap-2.5 rounded-xl border border-white/20 bg-white/12 px-5 font-display text-[15px] font-semibold text-white backdrop-blur-[6px] transition-colors hover:bg-white/20 sm:px-6 sm:text-[16px]"
            >
              <InfoIcon className="h-[18px] w-[18px]" />
              Mais informações
            </Link>
          </div>
        </div>

        {/* Indicadores: barra que preenche no slide ativo. */}
        <div className="mt-9 flex items-center gap-2.5 lg:absolute lg:right-10 lg:bottom-20 lg:mt-0">
          {items.map((media, i) => (
            <button
              key={media.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ver ${media.title}`}
              aria-current={i === index}
              className="group/dot h-2.5 py-2"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${
                  i === index
                    ? 'w-10 bg-gradient-to-r from-amber-hi to-amber-mid'
                    : 'w-5 bg-white/30 group-hover/dot:bg-white/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
