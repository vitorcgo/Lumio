import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { LiveScreen } from '@/components/Live/LiveScreen';
import { getChannel, getMedia } from '@/lib/catalog';
import { CHANNELS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'TV Ao Vivo',
  description: 'Canais abertos, esportes, notícias e filmes ao vivo, com a grade completa do dia.',
};

/** Canal em destaque e a arte usada como fundo, como no protótipo. */
const FEATURED_CHANNEL_ID = 108;
const FEATURED_ART_ID = 21;

export default function LivePage() {
  const featured = getChannel(FEATURED_CHANNEL_ID);
  const featuredArt = getMedia(FEATURED_ART_ID);
  if (!featured || !featuredArt) notFound();

  return (
    <>
      <LiveScreen channels={[...CHANNELS]} featured={featured} featuredArt={featuredArt} />
      <Footer />
    </>
  );
}
