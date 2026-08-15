'use client';

import { ChevronLeftIcon, ChevronRightIcon } from './icons';

/**
 * Monta a lista de páginas com reticências: sempre a primeira, a última e a
 * atual com uma vizinha de cada lado. Evita uma régua de 40 botões.
 */
function pageList(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const visible = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const out: (number | 'gap')[] = [];
  let previous = 0;
  for (const p of visible) {
    if (previous && p - previous > 1) out.push('gap');
    out.push(p);
    previous = p;
  }
  return out;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** faixa exibida, ex.: "Mostrando 1–24 de 120" */
  from: number;
  to: number;
  total: number;
  /** id do elemento para onde rolar ao trocar de página */
  scrollTargetId?: string;
  /** singular do que está sendo contado */
  noun?: string;
}

const BUTTON =
  'grid h-10 min-w-10 place-items-center rounded-[10px] px-3 text-sm font-semibold transition-colors';

export function Pagination({
  page,
  totalPages,
  onChange,
  from,
  to,
  total,
  scrollTargetId,
  noun = 'títulos',
}: PaginationProps) {
  const go = (next: number) => {
    if (next < 1 || next > totalPages || next === page) return;
    onChange(next);
    if (scrollTargetId) {
      document
        .getElementById(scrollTargetId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <p role="status" className="text-sm text-white/50">
        Mostrando{' '}
        <strong className="font-semibold text-white/80">
          {from}–{to}
        </strong>{' '}
        de <strong className="font-semibold text-white/80">{total}</strong> {noun}
      </p>

      {/* Com uma página só, a régua não tem função. */}
      {totalPages > 1 ? (
        <nav aria-label="Paginação">
          <ul className="flex flex-wrap items-center justify-center gap-1.5">
            <li>
              <button
                type="button"
                onClick={() => go(page - 1)}
                disabled={page === 1}
                aria-label="Página anterior"
                className={`${BUTTON} border border-white/12 bg-white/5 text-white hover:bg-white/12 disabled:pointer-events-none disabled:opacity-35`}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
            </li>

            {pageList(page, totalPages).map((entry, i) =>
              entry === 'gap' ? (
                <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-white/35">
                  …
                </li>
              ) : (
                <li key={entry}>
                  <button
                    type="button"
                    onClick={() => go(entry)}
                    aria-label={`Página ${entry}`}
                    aria-current={entry === page ? 'page' : undefined}
                    className={`${BUTTON} ${
                      entry === page
                        ? 'bg-gradient-to-br from-amber-hi to-amber-mid text-night'
                        : 'border border-white/12 bg-white/5 text-white/80 hover:bg-white/12 hover:text-white'
                    }`}
                  >
                    {entry}
                  </button>
                </li>
              ),
            )}

            <li>
              <button
                type="button"
                onClick={() => go(page + 1)}
                disabled={page === totalPages}
                aria-label="Próxima página"
                className={`${BUTTON} border border-white/12 bg-white/5 text-white hover:bg-white/12 disabled:pointer-events-none disabled:opacity-35`}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
