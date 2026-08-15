'use client';

import { useMemo, useState } from 'react';

import { GenreChips } from './GenreChips';
import { MediaCard } from './MediaCard';
import { RowScroller, SectionHeading } from './MediaRow';
import { Pagination } from './Pagination';
import { usePagination } from '@/hooks/usePagination';
import { COUNTRY_CODE } from '@/lib/doramas';
import type { MediaView } from '@/lib/types';

const GRID_SIZES = '(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 200px';

const PER_PAGE = 24;

const SORTS = {
  rating: 'Mais bem avaliados',
  recent: 'Mais recentes',
  alpha: 'Ordem alfabética',
  episodes: 'Mais episódios',
} as const;

type SortKey = keyof typeof SORTS;

function totalEpisodes(m: MediaView): number {
  return (m.seasons ?? 1) * (m.epCount ?? 0);
}

/** Legenda sob o pôster: país, emissora e volume de episódios. */
function CollectionMeta({ media }: { media: MediaView }) {
  const code = media.country ? COUNTRY_CODE[media.country] : undefined;
  return (
    <div className="mt-2 space-y-0.5">
      <p className="flex items-center gap-1.5 truncate text-[13px] font-semibold text-white/85">
        {code ? (
          <span className="rounded border border-amber/35 bg-amber/12 px-1.5 py-px text-[10px] font-bold tracking-wider text-amber-soft">
            {code}
          </span>
        ) : null}
        {media.country}
      </p>
      <p className="truncate text-[12px] text-white/45">
        {media.network} · {media.seasons}{' '}
        {(media.seasons ?? 1) > 1 ? 'temporadas' : 'temporada'} · {totalEpisodes(media)} eps
      </p>
    </div>
  );
}

interface CollectionCatalogProps {
  items: MediaView[];
  genres: readonly string[];
  /** singular usado nas contagens, ex.: "dorama", "novela" */
  noun: string;
  featuredTitle?: string;
}

/**
 * Grade de uma coleção (doramas, novelas turcas…).
 *
 * Doramas e turcas tinham exatamente o mesmo comportamento, então dividem este
 * componente em vez de existirem duas cópias que fatalmente divergiriam.
 */
export function CollectionCatalog({
  items,
  genres,
  noun,
  featuredTitle = 'Destaques do momento',
}: CollectionCatalogProps) {
  const [genre, setGenre] = useState('Todos');
  const [sort, setSort] = useState<SortKey>('rating');

  const filtered = useMemo(() => {
    const list = genre === 'Todos' ? [...items] : items.filter((m) => m.genre === genre);

    const sorters: Record<SortKey, (a: MediaView, b: MediaView) => number> = {
      rating: (a, b) => b.rating - a.rating,
      recent: (a, b) => b.year - a.year,
      alpha: (a, b) => a.title.localeCompare(b.title, 'pt-BR'),
      episodes: (a, b) => totalEpisodes(b) - totalEpisodes(a),
    };

    return list.sort(sorters[sort]);
  }, [items, genre, sort]);

  const paged = usePagination(filtered, PER_PAGE, `${genre}|${sort}`);

  // Os destaques acompanham o filtro: senão a fileira contradiria a grade.
  const featured = useMemo(
    () => [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 8),
    [filtered],
  );

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <GenreChips
            genres={genres}
            active={genre}
            onSelect={setGenre}
            label={`Filtrar ${noun}s por gênero`}
          />

          <div className="flex items-center gap-2.5">
            <label htmlFor="ordenar" className="text-sm whitespace-nowrap text-white/55">
              Ordenar por
            </label>
            <select
              id="ordenar"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-[10px] border border-white/14 bg-surface px-3.5 py-2.5 text-sm font-semibold text-white"
            >
              {Object.entries(SORTS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p role="status" className="mt-4 text-sm text-white/55">
          <strong className="font-bold text-amber-soft">{filtered.length}</strong> {noun}(s)
        </p>
      </div>

      {featured.length > 0 ? (
        <section className="mt-9">
          <SectionHeading className="px-4 pb-4 sm:px-6 lg:px-10">{featuredTitle}</SectionHeading>
          <RowScroller label={featuredTitle}>
            {featured.map((media) => (
              <li key={media.id} className="snap-item w-[132px] shrink-0 sm:w-[160px] lg:w-[196px]">
                <MediaCard media={media} />
                <CollectionMeta media={media} />
              </li>
            ))}
          </RowScroller>
        </section>
      ) : null}

      <div className="mt-9 px-4 sm:px-6 lg:px-10">
        <SectionHeading className="pb-5">Catálogo completo</SectionHeading>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-white/50">
            Nenhum título em <strong className="text-white">{genre}</strong>. Tente outro gênero.
          </p>
        ) : (
          <>
            <ul
              id="grade-colecao"
              className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:gap-5 lg:grid-cols-[repeat(auto-fill,minmax(184px,1fr))] lg:gap-[22px]"
            >
              {paged.items.map((media) => (
                <li key={media.id}>
                  <MediaCard media={media} sizes={GRID_SIZES} />
                  <CollectionMeta media={media} />
                </li>
              ))}
            </ul>

            <Pagination
              page={paged.page}
              totalPages={paged.totalPages}
              onChange={paged.setPage}
              from={paged.from}
              to={paged.to}
              total={paged.total}
              scrollTargetId="grade-colecao"
              noun={`${noun}s`}
            />
          </>
        )}
      </div>
    </>
  );
}
