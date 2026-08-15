import type { Metadata } from 'next';

import { Footer } from '@/components/Footer';
import { MyListGrid } from '@/components/MyListGrid';

export const metadata: Metadata = {
  title: 'Minha Lista',
  description: 'Os títulos que você salvou para assistir depois.',
};

export default function MyListPage() {
  return (
    <>
      <div className="min-h-[80vh] px-4 pt-8 pb-10 sm:px-6 lg:px-10">
        <h1 className="font-display text-[30px] font-bold -tracking-[.02em] sm:text-[40px]">
          Minha Lista
        </h1>
        <p className="mt-2 mb-7 max-w-[640px] text-[15px] text-white/50">
          Tudo o que você salvou fica guardado neste aparelho.
        </p>
        <MyListGrid />
      </div>
      <Footer />
    </>
  );
}
