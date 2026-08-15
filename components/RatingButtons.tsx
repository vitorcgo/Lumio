'use client';

import { ThumbDownIcon, ThumbUpIcon } from './icons';
import { useRatings } from '@/hooks/useRatings';

const BASE =
  'inline-flex h-[52px] w-[52px] items-center justify-center rounded-xl border transition-colors';

/**
 * Avaliação do título. É persistida e realimenta as recomendações
 * da Home: positiva gera uma fileira do gênero, negativa tira o título das indicações.
 */
export function RatingButtons({ id, title }: { id: number; title: string }) {
  const { ratingOf, toggle } = useRatings();
  const rating = ratingOf(id);

  return (
    <>
      <button
        type="button"
        onClick={() => toggle(id, 'up')}
        aria-pressed={rating === 'up'}
        aria-label={`Gostei de ${title}`}
        title="Gostei"
        className={`${BASE} ${
          rating === 'up'
            ? 'border-amber/55 bg-amber/18 text-amber-soft'
            : 'border-white/16 bg-white/8 text-white hover:bg-white/14'
        }`}
      >
        <ThumbUpIcon className="h-[22px] w-[22px]" />
      </button>

      <button
        type="button"
        onClick={() => toggle(id, 'down')}
        aria-pressed={rating === 'down'}
        aria-label={`Não gostei de ${title}`}
        title="Não gostei"
        className={`${BASE} ${
          rating === 'down'
            ? 'border-danger/50 bg-danger/16 text-[#ff9a9a]'
            : 'border-white/16 bg-white/8 text-white hover:bg-white/14'
        }`}
      >
        <ThumbDownIcon className="h-[22px] w-[22px]" />
      </button>
    </>
  );
}
