'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

import { GenreChips } from './GenreChips';
import { MediaCard } from './MediaCard';
import { Pagination } from './Pagination';
import { CloseIcon, HistoryIcon, SearchIcon } from './icons';
import { useHydrated } from '@/hooks/useHydrated';
import { usePagination } from '@/hooks/usePagination';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { searchCatalog } from '@/lib/catalog';
import { POPULAR_SEARCHES, SEARCH_GENRES } from '@/lib/data';

const GRID =
  'grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:gap-5';

const GRID_SIZES = '(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 190px';

const PER_PAGE = 24;

export function SearchScreen() {
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get('q') ?? '');
  const [genre, setGenre] = useState(() => {
    const g = params.get('genre');
    return g && SEARCH_GENRES.includes(g) ? g : 'Todos';
  });

  const { history, push, remove, clear } = useSearchHistory();
  const hydrated = useHydrated();

  const results = useMemo(() => searchCatalog(query, genre), [query, genre]);
  const isEmptyQuery = query.trim() === '';
  const paged = usePagination(results, PER_PAGE, `${query.trim().toLowerCase()}|${genre}`);

  const inputRef = useRef<HTMLInputElement>(null);

  // Quem abre a busca quer digitar: o cursor já entra no campo.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') push(query);
    if (e.key === 'Escape' && query) {
      e.preventDefault();
      setQuery('');
    }
  };

  return (
    <div className="mx-auto min-h-[80vh] max-w-[1240px] px-4 pt-6 pb-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[720px]">
        <label htmlFor="busca" className="sr-only">
          Buscar filmes, séries, animes e canais
        </label>
        <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 focus-within:border-amber/50">
          <SearchIcon className="h-[18px] w-[18px] shrink-0 text-white/60" />
          <input
            ref={inputRef}
            id="busca"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscar filmes, séries, animes e canais..."
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white/40 sm:text-[18px]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Limpar busca"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <p className="mt-2.5 text-[12px] text-white/30">
          <kbd className="font-semibold text-white/50">Esc</kbd> limpa ·{' '}
          <kbd className="font-semibold text-white/50">Enter</kbd> salva no histórico
        </p>
      </div>

      {/* Uma pista rolável em vez de duas linhas centralizadas: os gêneros
          crescem com o catálogo e a quebra ficava desalinhada do resto. */}
      <div className="mx-auto my-6 max-w-[720px]">
        <div className="row-scroll -mx-1 px-1">
          <GenreChips
            genres={SEARCH_GENRES}
            active={genre}
            onSelect={setGenre}
            label="Filtrar por gênero"
            className="w-max flex-nowrap"
          />
        </div>
      </div>

      {isEmptyQuery ? (
        <div className="mx-auto mb-7 max-w-[720px]">
          {hydrated && history.length > 0 ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[13px] font-bold tracking-[.1em] text-white/50 uppercase">
                  Buscas recentes
                </h2>
                <button
                  type="button"
                  onClick={clear}
                  className="text-[13px] text-white/50 transition-colors hover:text-amber-soft"
                >
                  Limpar
                </button>
              </div>
              <ul className="mb-6 flex flex-wrap gap-2.5">
                {history.map((term) => (
                  <li
                    key={term}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 pr-3 pl-4 text-sm font-semibold text-white/85"
                  >
                    <button
                      type="button"
                      onClick={() => setQuery(term)}
                      className="inline-flex items-center gap-1.5 py-2.5"
                    >
                      <HistoryIcon className="h-3.5 w-3.5 opacity-50" />
                      {term}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(term)}
                      aria-label={`Remover "${term}" do histórico`}
                      className="p-1 opacity-50 transition-opacity hover:opacity-100"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <h2 className="mb-3 text-[13px] font-bold tracking-[.1em] text-white/50 uppercase">
            Sugestões
          </h2>
          <ul className="flex flex-wrap gap-2.5">
            {POPULAR_SEARCHES.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-amber/28 bg-amber/10 px-4 py-2.5 text-sm font-semibold text-amber-soft transition-colors hover:bg-amber/18"
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p role="status" className="mb-4 text-sm text-white/55">
        {results.length} resultado(s)
        {isEmptyQuery ? null : (
          <>
            {' '}
            para <strong className="font-semibold text-white">“{query.trim()}”</strong>
          </>
        )}
      </p>

      {results.length === 0 ? (
        <div className="px-5 py-16 text-center text-white/50">
          <SearchIcon className="mx-auto mb-3 h-10 w-10 text-white/25" />
          <p className="font-display text-[22px] font-bold text-white">Nada encontrado</p>
          <p className="mt-2 text-[15px]">Tente outro termo ou remova os filtros de gênero.</p>
        </div>
      ) : (
        <>
          <ul id="grade-busca" className={GRID}>
            {paged.items.map((media) => (
              <li key={media.id}>
                <MediaCard media={media} sizes={GRID_SIZES} />
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
            scrollTargetId="grade-busca"
            noun="resultados"
          />
        </>
      )}
    </div>
  );
}
