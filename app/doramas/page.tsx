import type { Metadata } from 'next';

import { CollectionScreen } from '@/components/CollectionScreen';
import { getByType } from '@/lib/catalog';
import { DORAMA_GENRES } from '@/lib/doramas';

export const metadata: Metadata = {
  title: 'Doramas',
  description:
    'Todos os doramas da Lumio: romances, thrillers e dramas da Coreia do Sul, Japão, China e Tailândia.',
};

export default function DoramasPage() {
  return (
    <CollectionScreen
      items={getByType('dorama')}
      genres={DORAMA_GENRES}
      badge="Coleção Lumio"
      title="Doramas"
      description="Romances que atravessam fronteiras, thrillers de tirar o fôlego e dramas do cotidiano. Todo o catálogo asiático da Lumio em um só lugar, legendado e dublado em português."
      noun="dorama"
    />
  );
}
