'use client';

import Link from 'next/link';

import { ListCard } from './MediaCard';
import { Pagination } from './Pagination';
import { BookmarkIcon } from './icons';
import { useHydrated } from '@/hooks/useHydrated';
import { useMyList } from '@/hooks/useMyList';
import { usePagination } from '@/hooks/usePagination';
import { toast } from '@/lib/toast';

const GRID =
  'grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:gap-5 lg:grid-cols-[repeat(auto-fill,minmax(184px,1fr))] lg:gap-[22px]';

const GRID_SIZES = '(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 200px';

const PER_PAGE = 24;

export function MyListGrid() {
  const { items, toggle } = useMyList();
  const hydrated = useHydrated();
  // A lista só muda de tamanho quando o usuário adiciona ou remove.
  const paged = usePagination(items, PER_PAGE, String(items.length));

  // Antes de ler o localStorage a lista está vazia; mostrar "lista vazia" nesse
  // instante seria mentira, então segura o estado vazio até hidratar.
  if (!hydrated) {
    return (
      <div className={GRID} aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton aspect-2/3 rounded-[14px]" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/8 bg-surface/60 px-6 py-16 text-center">
        <BookmarkIcon className="mx-auto h-10 w-10 text-white/25" />
        <p className="mt-3 font-display text-xl font-bold">Sua lista está vazia</p>
        <p className="mx-auto mt-2 max-w-[420px] text-[15px] text-white/55">
          Abra um título e toque em <strong className="text-amber-soft">+ Minha lista</strong> para
          guardá-lo aqui.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-gradient-to-br from-amber-hi to-amber-mid px-6 py-3 font-display font-bold text-night"
        >
          Explorar o catálogo
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul id="grade-lista" className={GRID}>
        {paged.items.map((media) => (
          <li key={media.id}>
            <ListCard
              media={media}
              sizes={GRID_SIZES}
              onRemove={() => {
                toggle(media.id);
                toast(`"${media.title}" saiu da sua lista.`, {
                  label: 'Desfazer',
                  run: () => toggle(media.id),
                });
              }}
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
        scrollTargetId="grade-lista"
        noun="salvos"
      />
    </>
  );
}
