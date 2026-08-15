'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { RatingButtons } from './RatingButtons';
import { ShareButton } from './ShareButton';
import { CheckIcon, PlayIcon, PlusIcon } from './icons';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import { useMyList } from '@/hooks/useMyList';
import { toast } from '@/lib/toast';
import type { MediaView } from '@/lib/types';

/**
 * Barra de ações do detalhe: assistir/retomar, minha lista, avaliação e compartilhar.
 * O botão principal vira "Continuar" quando o título já está na fila.
 */
export function TitleActions({ media }: { media: MediaView }) {
  const { entries } = useContinueWatching();
  const { has, toggle } = useMyList();
  const inList = has(media.id);

  const { href, label } = useMemo(() => {
    const pending = entries.find(
      (e) => e.entry.id === media.id && e.entry.progress > 0 && e.entry.progress < 100,
    );
    if (pending) {
      return {
        href: pending.href,
        label:
          pending.entry.kind === 'ep'
            ? `Continuar T${pending.entry.season}:E${pending.entry.n}`
            : 'Continuar assistindo',
      };
    }
    return media.type === 'movie'
      ? { href: `/watch/movie/${media.id}`, label: 'Assistir agora' }
      : { href: `/watch/ep/${media.id}/1/1`, label: 'Assistir T1:E1' };
  }, [entries, media.id, media.type]);

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <Link
        href={href}
        className="inline-flex h-[52px] items-center gap-2.5 rounded-xl bg-gradient-to-br from-amber-hi to-amber-mid px-7 font-display text-[16px] font-bold text-night shadow-[0_12px_30px_rgba(255,190,26,.4)] transition-transform hover:scale-[1.03] sm:px-8 sm:text-[17px] motion-reduce:hover:scale-100"
      >
        <PlayIcon className="h-[18px] w-[18px]" />
        {label}
      </Link>

      <button
        type="button"
        onClick={() => {
          toggle(media.id);
          toast(
            inList
              ? `"${media.title}" saiu da sua lista.`
              : `"${media.title}" foi para a sua lista.`,
            { label: 'Desfazer', run: () => toggle(media.id) },
          );
        }}
        aria-pressed={inList}
        className={`inline-flex h-[52px] items-center gap-2 rounded-xl border px-5 font-display text-[15px] font-semibold transition-colors sm:text-[16px] ${
          inList
            ? 'border-amber/55 bg-amber/18 text-amber-soft'
            : 'border-white/20 bg-white/10 text-white hover:bg-white/16'
        }`}
      >
        {inList ? <CheckIcon className="h-[18px] w-[18px]" /> : <PlusIcon className="h-[18px] w-[18px]" />}
        {inList ? 'Na minha lista' : 'Minha lista'}
      </button>

      <Link
        href={`${media.type === 'movie' ? `/watch/movie/${media.id}` : `/watch/ep/${media.id}/1/1`}?trailer=1`}
        className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-5 font-display text-[15px] font-semibold text-white transition-colors hover:bg-white/14 sm:text-[16px]"
      >
        <PlayIcon className="h-4 w-4" />
        Trailer
      </Link>

      <RatingButtons id={media.id} title={media.title} />
      <ShareButton title={media.title} />
    </div>
  );
}
