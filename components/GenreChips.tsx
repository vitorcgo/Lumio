'use client';

import { memo } from 'react';

interface GenreChipsProps {
  genres: readonly string[];
  active: string;
  onSelect: (genre: string) => void;
  label: string;
  className?: string;
}

/** Filtro de gênero em pílulas. A ativa recebe o degradê âmbar da marca. */
export const GenreChips = memo(function GenreChips({
  genres,
  active,
  onSelect,
  label,
  className = '',
}: GenreChipsProps) {
  return (
    <div role="group" aria-label={label} className={`flex flex-wrap gap-2.5 ${className}`}>
      {genres.map((genre) => {
        const on = genre === active;
        return (
          <button
            key={genre}
            type="button"
            onClick={() => onSelect(genre)}
            aria-pressed={on}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-[18px] ${
              on
                ? 'border border-transparent bg-gradient-to-br from-amber-hi to-amber-mid text-night'
                : 'border border-white/10 bg-white/5 text-white/80 hover:border-amber/40 hover:text-white'
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
});
