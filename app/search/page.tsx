import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SearchScreen } from '@/components/SearchScreen';
import { SkeletonGrid } from '@/components/SkeletonRow';

export const metadata: Metadata = {
  title: 'Busca',
  description: 'Busque filmes, séries, animes e canais no catálogo da Lumio.',
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] px-4 pt-6 pb-16 sm:px-6 lg:px-10">
          <div className="skeleton mx-auto mb-8 h-[58px] max-w-[720px] rounded-2xl" />
          <SkeletonGrid />
        </div>
      }
    >
      <SearchScreen />
    </Suspense>
  );
}
