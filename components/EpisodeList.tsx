'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { PosterImage } from './PosterImage';
import { CheckIcon, PlayIcon } from './icons';
import { getEpisodes, seededEpisodeProgress } from '@/lib/catalog';
import { useUserStore } from '@/lib/store';
import { toast } from '@/lib/toast';
import type { MediaView } from '@/lib/types';

const BADGE = 'rounded-full px-2.5 py-[3px] text-[11px] font-extrabold';

function EpisodeBadge({ progress, isNew }: { progress: number; isNew: boolean }) {
  if (progress >= 100) {
    return (
      <span className={`${BADGE} inline-flex items-center gap-1 bg-amber/92 text-night`}>
        <CheckIcon className="h-3 w-3" strokeWidth={3} />
        Assistido
      </span>
    );
  }
  if (progress > 0) {
    return (
      <span className={`${BADGE} border border-amber/40 bg-white/10 text-amber-soft`}>
        Continuar
      </span>
    );
  }
  if (isNew) {
    return <span className={`${BADGE} bg-amber tracking-[.04em] text-night`}>NOVO</span>;
  }
  return null;
}

export function EpisodeList({ media }: { media: MediaView }) {
  const seasonCount = media.seasons ?? 1;
  const [season, setSeason] = useState(1);
  const cont = useUserStore((s) => s.cont);
  const touchContinue = useUserStore((s) => s.touchContinue);
  const setContinueProgress = useUserStore((s) => s.setContinueProgress);

  const episodes = useMemo(() => getEpisodes(media, season), [media, season]);

  // O progresso salvo pelo player tem precedência sobre o estado semeado.
  const progressFor = useMemo(() => {
    const saved = new Map(cont.map((e) => [e.key, e.progress]));
    return (n: number) =>
      saved.get(`e${media.id}-${season}-${n}`) ?? seededEpisodeProgress(media.id, season, n);
  }, [cont, media.id, season]);

  /** Alterna entre "assistido" e "não assistido" sem precisar abrir o player. */
  const toggleWatched = (n: number, current: number) => {
    const key = `e${media.id}-${season}-${n}`;
    const next = current >= 100 ? 0 : 100;
    touchContinue({ key, id: media.id, kind: 'ep', season, n, progress: next });
    setContinueProgress(key, next);
    toast(
      next === 100
        ? `Episódio ${n} marcado como assistido.`
        : `Episódio ${n} marcado como não assistido.`,
      { label: 'Desfazer', run: () => toggleWatched(n, next) },
    );
  };

  return (
    <section className="mx-auto max-w-[1100px] px-4 pt-2 pb-5 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center gap-3.5">
        <h2 className="font-display text-[22px] font-bold sm:text-2xl">Episódios</h2>

        {seasonCount > 1 ? (
          <>
            <label htmlFor="temporada" className="sr-only">
              Escolher temporada
            </label>
            <select
              id="temporada"
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="rounded-[10px] border border-white/14 bg-surface px-4 py-2.5 font-semibold text-white"
            >
              {Array.from({ length: seasonCount }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Temporada {i + 1}
                </option>
              ))}
            </select>
          </>
        ) : null}

        <p className="text-sm text-white/45">{media.seasonsLabel}</p>
      </div>

      <ul className="flex flex-col gap-3 pt-5 pb-3">
        {episodes.map((ep) => {
          const progress = progressFor(ep.n);
          const isNew = progress === 0 && ep.n > (media.epCount ?? 0) - 2;

          return (
            <li
              key={`${season}-${ep.n}`}
              className="relative motion-safe:animate-slide-right"
              // Escalonado: a lista entra em cascata ao trocar de temporada.
              style={{ animationDelay: `${Math.min(ep.n - 1, 10) * 40}ms` }}
            >
              <Link
                href={`/watch/ep/${media.id}/${season}/${ep.n}`}
                aria-label={`Reproduzir episódio ${ep.n}: ${ep.name}, ${ep.dur} minutos`}
                className="group/ep flex items-center gap-3 rounded-[14px] border border-white/7 bg-surface p-3 transition-colors hover:border-amber/55 hover:bg-[#16161f] sm:gap-4"
              >
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 text-center font-display text-xl font-extrabold text-white/32 sm:w-[30px] sm:text-[26px]"
                >
                  {ep.n}
                </span>

                <span className="relative block aspect-16/9 w-[110px] shrink-0 overflow-hidden rounded-[10px] bg-surface-2 sm:w-[150px]">
                  <PosterImage
                    src={ep.thumb}
                    alt=""
                    hue={media.hue}
                    sizes="(max-width: 639px) 110px, 150px"
                    position="center 22%"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 grid place-items-center bg-black/18"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/45 bg-black/45 backdrop-blur-[4px] transition-colors group-hover/ep:border-amber group-hover/ep:bg-amber group-hover/ep:text-night">
                      <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
                    </span>
                  </span>
                  {progress > 0 && progress < 100 ? (
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-black/50">
                      <span
                        className="block h-full bg-gradient-to-r from-amber-hi to-amber-mid"
                        style={{ width: `${progress}%` }}
                      />
                    </span>
                  ) : null}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[11px] font-extrabold tracking-[.1em] text-amber-soft uppercase sm:text-xs">
                      Episódio {ep.n}
                    </span>
                    <EpisodeBadge progress={progress} isNew={isNew} />
                  </span>
                  <span className="mt-1 block font-display text-[15px] leading-tight font-bold sm:text-[17px]">
                    {ep.name}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-pretty text-white/50 sm:text-sm">
                    {ep.desc}
                  </span>
                  <span className="mt-1 block text-[13px] text-white/45 sm:hidden">
                    {ep.dur}min
                  </span>
                </span>

                <span className="hidden shrink-0 pr-11 text-sm tabular-nums whitespace-nowrap text-white/55 sm:block">
                  {ep.dur}min
                </span>
              </Link>

              {/* Fora do link: um `<a>` não pode conter outro elemento interativo. */}
              <button
                type="button"
                onClick={() => toggleWatched(ep.n, progress)}
                aria-pressed={progress >= 100}
                title={progress >= 100 ? 'Marcar como não assistido' : 'Marcar como assistido'}
                aria-label={`${progress >= 100 ? 'Marcar como não assistido' : 'Marcar como assistido'}: episódio ${ep.n}, ${ep.name}`}
                className={`absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full border transition-colors sm:top-1/2 sm:-translate-y-1/2 ${
                  progress >= 100
                    ? 'border-transparent bg-amber text-night'
                    : 'border-white/25 bg-black/50 text-white/70 hover:border-amber/60 hover:text-amber-soft'
                }`}
              >
                <CheckIcon className="h-4 w-4" strokeWidth={3} />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
