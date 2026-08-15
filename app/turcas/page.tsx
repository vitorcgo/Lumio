import type { Metadata } from 'next';

import { CollectionScreen } from '@/components/CollectionScreen';
import { getByType } from '@/lib/catalog';
import { TURCA_GENRES } from '@/lib/turcas';

export const metadata: Metadata = {
  title: 'Novelas Turcas',
  description:
    'Todas as novelas turcas da Lumio: paixões, vinganças e dramas de época de Istambul, dublados e legendados.',
};

export default function TurcasPage() {
  return (
    <CollectionScreen
      items={getByType('turca')}
      genres={TURCA_GENRES}
      badge="Coleção Lumio"
      title="Novelas Turcas"
      description="Paixões impossíveis, vinganças que atravessam gerações e dramas de época entre o Bósforo e os becos de Istambul. Capítulos longos, do jeito que a Turquia faz."
      noun="novela"
    />
  );
}
