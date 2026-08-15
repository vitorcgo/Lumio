import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BrowseGrid } from '@/components/BrowseGrid';
import { Footer } from '@/components/Footer';
import { getByType } from '@/lib/catalog';
import { KIND_META } from '@/lib/data';
import type { MediaType } from '@/lib/types';

const KINDS = ['movie', 'series', 'anime', 'dorama', 'turca'] as const;

function isKind(value: string): value is MediaType {
  return (KINDS as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return KINDS.map((kind) => ({ kind }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kind: string }>;
}): Promise<Metadata> {
  const { kind } = await params;
  if (!isKind(kind)) return {};
  return { title: KIND_META[kind].title, description: KIND_META[kind].sub };
}

export default async function BrowsePage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ genero?: string; ordem?: string }>;
}) {
  const { kind } = await params;
  if (!isKind(kind)) notFound();

  // Ler o filtro aqui torna a rota dinâmica, mas o primeiro paint já vem
  // filtrado: sem o piscar de skeleton que uma fronteira de Suspense traria.
  const { genero, ordem } = await searchParams;

  const meta = KIND_META[kind];
  const items = getByType(kind);

  return (
    <>
      <div className="min-h-[80vh] px-4 pt-8 pb-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end gap-3.5">
          <h1 className="font-display text-[30px] font-bold -tracking-[.02em] sm:text-[40px]">
            {meta.title}
          </h1>
          <p className="pb-2 text-[15px] text-white/45">{items.length} títulos</p>
        </div>
        <p className="mt-2 mb-6 max-w-[640px] text-[15px] text-white/50">{meta.sub}</p>

        <BrowseGrid
          items={items}
          genres={meta.genres}
          initialGenre={genero ?? 'Todos'}
          initialSort={ordem ?? 'destaque'}
        />
      </div>
      <Footer />
    </>
  );
}
