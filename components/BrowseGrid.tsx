'use client';

import { useCallback, useMemo, useState } from 'react';

import { GenreChips } from './GenreChips';
import { MediaCard } from './MediaCard';
import { Pagination } from './Pagination';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import { usePagination } from '@/hooks/usePagination';
import { useUserStore } from '@/lib/store';
import { isNewInBrowse } from '@/lib/rows';
import type { MediaView } from '@/lib/types';

const GRID =
  'grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:gap-5 lg:grid-cols-[repeat(auto-fill,minmax(184px,1fr))] lg:gap-[22px]';

const GRID_SIZES = '(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 200px';

/** Divisível por 2, 3, 4 e 6: fecha a última linha em qualquer largura. */
const PER_PAGE = 24;

const SORTS = {
  destaque: 'Em destaque',
  rating: 'Mais bem avaliados',
  recent: 'Mais recentes',
  alpha: 'Ordem alfabética',
} as const;

type SortKey = keyof typeof SORTS;

function isSortKey(value: string): value is SortKey {
  return value in SORTS;
}

interface BrowseGridProps {
  items: MediaView[];
  genres: readonly string[];
  /** valores lidos da URL no servidor: o primeiro paint já vem filtrado */
  initialGenre: string;
  initialSort: string;
}

export function BrowseGrid({ items, genres, initialGenre, initialSort }: BrowseGridProps) {
  const [genre, setGenre] = useState(() =>
    genres.includes(initialGenre) ? initialGenre : 'Todos',
  );
  const [sort, setSort] = useState<SortKey>(() =>
    isSortKey(initialSort) ? initialSort : 'destaque',
  );

  /**
   * Espelha o estado na URL sem navegar.
   *
   * `history.replaceState` em vez de `router.replace`: a troca de filtro é
   * instantânea (nada de ida ao servidor) e o endereço continua compartilhável
   * e correto ao voltar pelo histórico.
   */
  const syncUrl = useCallback((nextGenre: string, nextSort: SortKey) => {
    const params = new URLSearchParams(window.location.search);
    if (nextGenre === 'Todos') params.delete('genero');
    else params.set('genero', nextGenre);
    if (nextSort === 'destaque') params.delete('ordem');
    else params.set('ordem', nextSort);

    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, []);

  const pickGenre = useCallback(
    (g: string) => {
      setGenre(g);
      syncUrl(g, sort);
    },
    [sort, syncUrl],
  );

  const pickSort = useCallback(
    (s: SortKey) => {
      setSort(s);
      syncUrl(genre, s);
    },
    [genre, syncUrl],
  );

  const watched = useUserStore((s) => s.watched);
  const { entries } = useContinueWatching();

  const progressById = useMemo(() => {
    const map = new Map<number, number>();
    for (const { entry } of entries) {
      // Um título pode ter vários episódios na fila; mostra o mais recente.
      if (!map.has(entry.id)) map.set(entry.id, entry.progress);
    }
    return map;
  }, [entries]);

  const visible = useMemo(() => {
    const list = genre === 'Todos' ? [...items] : items.filter((x) => x.genre === genre);

    const sorters: Record<SortKey, ((a: MediaView, b: MediaView) => number) | null> = {
      destaque: null,
      rating: (a, b) => b.rating - a.rating,
      recent: (a, b) => b.year - a.year,
      alpha: (a, b) => a.title.localeCompare(b.title, 'pt-BR'),
    };

    const sorter = sorters[sort];
    return sorter ? list.sort(sorter) : list;
  }, [items, genre, sort]);

  const paged = usePagination(visible, PER_PAGE, `${genre}|${sort}`);

  return (
    <>
      <div className="mb-7 flex flex-wrap items-center gap-x-6 gap-y-4">
        <GenreChips
          genres={genres}
          active={genre}
          onSelect={pickGenre}
          label="Filtrar por gênero"
        />

        <div className="flex items-center gap-2.5">
          <label htmlFor="ordem" className="text-sm whitespace-nowrap text-white/55">
            Ordenar por
          </label>
          <select
            id="ordem"
            value={sort}
            onChange={(e) => pickSort(e.target.value as SortKey)}
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

      {visible.length === 0 ? (
        <p className="py-16 text-center text-white/50">
          Nenhum título em <strong className="text-white">{genre}</strong> por aqui.
        </p>
      ) : (
        <>
          <ul id="grade-browse" className={GRID}>
            {paged.items.map((media) => (
              <li key={media.id}>
                <MediaCard
                  media={media}
                  sizes={GRID_SIZES}
                  isNew={isNewInBrowse(media.id)}
                  watched={watched.includes(media.id)}
                  progress={progressById.get(media.id) ?? 0}
                />
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
            scrollTargetId="grade-browse"
          />
        </>
      )}
    </>
  );
}
