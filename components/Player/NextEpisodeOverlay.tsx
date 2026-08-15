'use client';

import { PosterImage } from '../PosterImage';
import { PlayIcon } from '../icons';

interface NextEpisodeOverlayProps {
  seconds: number;
  title: string;
  /** "Próximo episódio" ou "Próxima temporada" */
  heading?: string;
  thumb: string;
  hue: number;
  onPlayNow: () => void;
  onCancel: () => void;
}

/** Aviso de "próximo episódio" com contagem regressiva e autoplay. */
export function NextEpisodeOverlay({
  seconds,
  title,
  heading = 'Próximo episódio',
  thumb,
  hue,
  onPlayNow,
  onCancel,
}: NextEpisodeOverlayProps) {
  return (
    <div
      role="alertdialog"
      aria-label={`${heading} em ${seconds} segundos: ${title}`}
      className="absolute right-4 bottom-24 z-17 w-[300px] rounded-2xl border border-amber/40 bg-[#0e0e14]/97 p-4 shadow-[0_24px_60px_rgba(0,0,0,.7)] sm:right-6 sm:w-[340px]"
    >
      <p className="text-[11px] font-extrabold tracking-[.12em] text-white/50 uppercase">
        {heading} em <span aria-hidden="true">{seconds}s</span>
      </p>

      <div className="mt-2.5 flex gap-3">
        <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-[10px] bg-surface-2">
          <PosterImage src={thumb} alt="" hue={hue} sizes="120px" position="center 30%" />
        </div>
        <p className="min-w-0 flex-1 self-center font-display text-[15px] leading-tight font-bold">
          {title}
        </p>
      </div>

      <div className="mt-3.5 flex gap-2.5">
        <button
          type="button"
          onClick={onPlayNow}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-gradient-to-br from-amber-hi to-amber-mid py-2.5 text-sm font-bold text-night"
        >
          <PlayIcon className="h-4 w-4" />
          Assistir agora
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[10px] border border-white/18 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
