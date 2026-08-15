'use client';

import Link from 'next/link';
import { memo, type ReactNode } from 'react';

import { PosterImage } from './PosterImage';
import { BellIcon, CheckIcon, CloseIcon, InfoIcon, StarIcon } from './icons';
import type { MediaView } from '@/lib/types';

/** Tamanho padrão dos pôsteres, do celular ao desktop. */
export const POSTER_SIZES = '(max-width: 639px) 132px, (max-width: 1023px) 160px, 196px';

/**
 * Casca do card. É um `div`: e não um link: porque o card carrega botões
 * próprios; um `<a>` não pode conter outros elementos interativos.
 */
const SHELL =
  'sheen group/card relative block aspect-2/3 w-full overflow-hidden rounded-[14px] bg-surface-2 ' +
  'border-2 border-transparent shadow-[0_12px_30px_rgba(0,0,0,.45)] ' +
  'transition-[transform,border-color,box-shadow] duration-300 ' +
  'hover:-translate-y-1.5 hover:border-amber/75 hover:shadow-[0_18px_44px_rgba(0,0,0,.6)] ' +
  'focus-within:border-amber/75 motion-reduce:hover:translate-y-0';

/** Botão redondo sobreposto ao card (remover da fila, remover da lista). */
const OVERLAY_BUTTON =
  'absolute top-2.5 z-4 grid h-[30px] w-[30px] place-items-center rounded-full border border-white/35 bg-black/60 text-white backdrop-blur-[4px] transition-colors';

interface CardBodyProps {
  media: MediaView;
  progress?: number;
  soonLabel?: string;
  isNew?: boolean;
  watched?: boolean;
  showRating: boolean;
  priority: boolean;
  sizes: string;
  extra?: ReactNode;
}

function CardBody({
  media,
  progress = 0,
  soonLabel,
  isNew,
  watched,
  showRating,
  priority,
  sizes,
  extra,
}: CardBodyProps) {
  return (
    <>
      <PosterImage src={media.img} alt="" hue={media.hue} sizes={sizes} priority={priority} />

      {/* Nos cards "em breve" o rodapé abre espaço para o botão de lembrete. */}
      <div
        className={`absolute inset-0 z-2 flex flex-col justify-end bg-gradient-to-b from-transparent from-40% to-black/55 p-3 sm:p-4 ${
          soonLabel ? 'pb-12 sm:pb-12' : ''
        }`}
      >
        <p className="text-[10px] font-bold tracking-[.12em] text-white/55 uppercase sm:text-[11px]">
          {media.genre}
        </p>
        <p className="mt-1 font-display text-[15px] leading-tight font-extrabold text-balance sm:text-[17px] lg:text-[19px]">
          {media.title}
        </p>
      </div>

      {soonLabel ? (
        <span className="absolute top-2.5 left-2.5 z-2 rounded-full bg-amber/92 px-2.5 py-[5px] text-[10px] font-extrabold tracking-[.06em] text-night">
          EM BREVE · {soonLabel}
        </span>
      ) : showRating ? (
        <span className="absolute top-2.5 left-2.5 z-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-[5px] text-[11px] font-bold text-amber-soft backdrop-blur-[4px]">
          <StarIcon className="h-3 w-3" />
          {media.ratingText}
        </span>
      ) : null}

      {!soonLabel && watched && !progress ? (
        <span
          className="absolute top-2.5 right-2.5 z-2 grid h-[26px] w-[26px] place-items-center rounded-full bg-amber/92 text-night"
          title="Já assistido"
        >
          <CheckIcon className="h-4 w-4" strokeWidth={3} />
        </span>
      ) : null}

      {!soonLabel && isNew && !watched ? (
        <span className="absolute top-2.5 right-2.5 z-2 rounded-md bg-amber px-2 py-1 text-[10px] font-extrabold tracking-[.08em] text-night">
          NOVO
        </span>
      ) : null}

      {progress > 0 ? (
        <div className="absolute inset-x-0 bottom-0 z-2 h-[5px] bg-black/50">
          <div
            className="h-full bg-gradient-to-r from-amber-hi to-amber-mid"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      {extra}
    </>
  );
}

interface MediaCardProps {
  media: MediaView;
  href?: string;
  progress?: number;
  isNew?: boolean;
  watched?: boolean;
  showRating?: boolean;
  priority?: boolean;
  sizes?: string;
  ariaLabel?: string;
  className?: string;
}

export const MediaCard = memo(function MediaCard({
  media,
  href,
  progress = 0,
  isNew,
  watched,
  showRating = true,
  priority = false,
  sizes = POSTER_SIZES,
  ariaLabel,
  className = '',
}: MediaCardProps) {
  // Um link simples, sem botões flutuantes: o card leva à ficha do título e é
  // de lá que se decide assistir. Menos passos, menos coisa aparecendo no hover.
  return (
    <Link
      href={href ?? `/title/${media.id}`}
      aria-label={ariaLabel ?? `${media.title}, ${media.typeLabel} de ${media.genre}, ${media.year}`}
      className={`${SHELL} ${className}`}
    >
      <CardBody
        media={media}
        progress={progress}
        isNew={isNew}
        watched={watched}
        showRating={showRating}
        priority={priority}
        sizes={sizes}
      />
    </Link>
  );
});

interface ContinueCardProps {
  media: MediaView;
  href: string;
  progress: number;
  label: string;
  onRemove: () => void;
  sizes?: string;
  className?: string;
}

/** Card da fileira "Continuar assistindo", com botão para tirar da fila. */
export const ContinueCard = memo(function ContinueCard({
  media,
  href,
  progress,
  label,
  onRemove,
  sizes = POSTER_SIZES,
  className = '',
}: ContinueCardProps) {
  return (
    <div className={`${SHELL} ${className}`}>
      <CardBody media={media} progress={progress} showRating={false} priority={false} sizes={sizes} />
      <Link
        href={href}
        aria-label={`Continuar assistindo ${label}, ${Math.round(progress)}% concluído`}
        className="absolute inset-0 z-3"
      />
      {/* O card retoma a reprodução, então a ficha do título ganha um atalho próprio. */}
      <Link
        href={`/title/${media.id}`}
        title="Ver detalhes"
        aria-label={`Ver detalhes de ${media.title}`}
        className={`${OVERLAY_BUTTON} left-2.5 hover:border-transparent hover:bg-amber hover:text-night`}
      >
        <InfoIcon className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={onRemove}
        title="Remover de Continuar assistindo"
        aria-label={`Remover ${label} de Continuar assistindo`}
        className={`${OVERLAY_BUTTON} right-2.5 hover:border-transparent hover:bg-danger/90`}
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
});

interface ListCardProps {
  media: MediaView;
  onRemove: () => void;
  sizes?: string;
}

/** Card da Minha Lista: dá para tirar da lista sem abrir a ficha. */
export const ListCard = memo(function ListCard({ media, onRemove, sizes = POSTER_SIZES }: ListCardProps) {
  return (
    <div className={SHELL}>
      <CardBody media={media} showRating priority={false} sizes={sizes} />
      <Link
        href={`/title/${media.id}`}
        aria-label={`${media.title}: ${media.typeLabel}, ${media.genre}, ${media.year}`}
        className="absolute inset-0 z-3"
      />
      <button
        type="button"
        onClick={onRemove}
        title="Remover da minha lista"
        aria-label={`Remover ${media.title} da minha lista`}
        className={`${OVERLAY_BUTTON} right-2.5 hover:border-transparent hover:bg-danger/90`}
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
});

interface SoonCardProps {
  media: MediaView;
  soonLabel: string;
  reminded: boolean;
  onToggle: () => void;
  sizes?: string;
  className?: string;
}

/** Card de "Chegando em breve": não abre o título, só liga/desliga o lembrete. */
export const SoonCard = memo(function SoonCard({
  media,
  soonLabel,
  reminded,
  onToggle,
  sizes = POSTER_SIZES,
  className = '',
}: SoonCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={reminded}
      aria-label={`${reminded ? 'Cancelar lembrete de' : 'Lembrar-me de'} ${media.title}, estreia em ${soonLabel}`}
      className={`${SHELL} text-left ${className}`}
    >
      <CardBody
        media={media}
        soonLabel={soonLabel}
        showRating={false}
        priority={false}
        sizes={sizes}
        extra={
          // Rótulo escrito, não só o sininho: sem ele ninguém adivinha que o
          // clique liga um lembrete em vez de abrir o título.
          <span
            className={`absolute inset-x-2 bottom-2 z-4 inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] font-bold ${
              reminded
                ? 'bg-amber text-night'
                : 'border border-white/40 bg-black/65 text-white backdrop-blur-[4px]'
            }`}
          >
            <BellIcon className="h-3.5 w-3.5" filled={reminded} />
            {reminded ? 'Lembrete ativo' : 'Lembrar-me'}
          </span>
        }
      />
    </button>
  );
});
