'use client';

import Link from 'next/link';

import { SectionHeading, RowScroller } from './MediaRow';
import { PosterImage } from './PosterImage';
import type { MediaView } from '@/lib/types';

const TOP10_SIZES = '(max-width: 639px) 220px, (max-width: 1023px) 260px, 300px';

/** Top 10 do dia: card deitado com o número gigante vazado atrás. */
export function Top10Row({ items }: { items: readonly MediaView[] }) {
  return (
    <section className="mt-8 sm:mt-11">
      <SectionHeading className="px-4 pb-4 sm:px-6 lg:px-10">Top 10 de hoje</SectionHeading>
      <RowScroller label="Top 10 de hoje">
        {items.map((media, i) => {
          const rank = i + 1;
          // O "10" tem o dobro da largura: sem mais recuo e um corpo menor, o
          // card cobria o zero inteiro e sobrava só o "1".
          const wide = rank >= 10;

          return (
          <li
            key={media.id}
            className={`snap-item relative flex h-[150px] shrink-0 items-end sm:h-[180px] lg:h-[214px] ${
              wide
                ? 'pl-[100px] sm:pl-[128px] lg:pl-[164px]'
                : 'pl-[62px] sm:pl-[78px] lg:pl-24'
            }`}
          >
            {/* Contorno âmbar com um preenchimento em degradê bem fraco: o número
                deixa de ser um elemento branco solto e passa a ser da marca.
                Encostado no bottom:0: vazar para fora tornava a fileira
                arrastável na vertical. */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-0 left-[-4px] z-1 bg-gradient-to-b from-amber-hi/30 via-amber-mid/12 to-transparent bg-clip-text font-display leading-[.8] font-bold text-transparent [-webkit-text-stroke:2px_rgba(255,194,26,.42)] lg:left-[-6px] ${
                wide
                  ? 'text-[118px] sm:text-[146px] lg:text-[182px]'
                  : 'text-[140px] sm:text-[170px] lg:text-[210px]'
              }`}
            >
              {rank}
            </span>
            <Link
              href={`/title/${media.id}`}
              aria-label={`Número ${rank}: ${media.title}: ${media.typeLabel}, ${media.genre}`}
              className="relative z-2 block aspect-16/9 w-[220px] overflow-hidden rounded-[14px] border-2 border-transparent bg-surface-2 shadow-[0_14px_34px_rgba(0,0,0,.5)] transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-amber/70 focus-visible:border-amber/70 sm:w-[260px] lg:w-[300px] motion-reduce:hover:translate-y-0"
            >
              <PosterImage
                src={media.img}
                alt=""
                hue={media.hue}
                sizes={TOP10_SIZES}
                position="center 30%"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-transparent from-42% to-black/85"
              />
              <span className="absolute inset-x-3.5 bottom-3">
                <span className="block text-[10px] font-bold tracking-[.14em] text-amber-soft uppercase">
                  {media.genre}
                </span>
                <span className="mt-1 block font-display text-[16px] leading-tight font-extrabold text-balance sm:text-[18px]">
                  {media.title}
                </span>
              </span>
            </Link>
          </li>
          );
        })}
      </RowScroller>
    </section>
  );
}
