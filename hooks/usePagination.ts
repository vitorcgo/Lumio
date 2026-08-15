'use client';

import { useEffect, useMemo, useState } from 'react';

export interface PaginationResult<T> {
  /** página atual, começando em 1 */
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  /** itens da página atual */
  items: T[];
  /** índice do primeiro item da página, começando em 1 */
  from: number;
  /** índice do último item da página */
  to: number;
  total: number;
}

/**
 * Fatia uma lista em páginas.
 *
 * `resetKey` deve conter tudo que muda o conjunto (filtro, ordenação, busca):
 * quando ele muda, a paginação volta para a primeira página: senão o usuário
 * filtraria e cairia numa página que não existe mais.
 */
export function usePagination<T>(
  all: readonly T[],
  perPage: number,
  resetKey: string,
): PaginationResult<T> {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // Se a lista encolher por outro caminho, a página atual pode ficar órfã.
  const current = Math.min(page, totalPages);

  const items = useMemo(
    () => all.slice((current - 1) * perPage, current * perPage) as T[],
    [all, current, perPage],
  );

  return {
    page: current,
    setPage,
    totalPages,
    items,
    from: total === 0 ? 0 : (current - 1) * perPage + 1,
    to: Math.min(current * perPage, total),
    total,
  };
}
