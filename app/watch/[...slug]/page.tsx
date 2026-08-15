import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PlayerScreen, type PlayerData } from '@/components/Player/PlayerScreen';
import { getChannel, getEpisodes, getMedia, getRelated } from '@/lib/catalog';
import type { Episode } from '@/lib/types';

/** Resolve `/watch/movie/1`, `/watch/ep/22/1/3` e `/watch/live/108`. */
function resolve(slug: string[]): PlayerData | null {
  const [kind, a, b, c] = slug;

  if (kind === 'movie' && a) {
    const media = getMedia(Number(a));
    if (!media || media.type !== 'movie') return null;
    return { mode: 'movie', media };
  }

  if (kind === 'ep' && a && b && c) {
    const media = getMedia(Number(a));
    const season = Number(b);
    const n = Number(c);
    if (!media || !media.isSeries) return null;
    if (!Number.isInteger(season) || season < 1 || season > (media.seasons ?? 1)) return null;

    const episodes = getEpisodes(media, season);
    const episode = episodes.find((e) => e.n === n);
    if (!episode) return null;

    // No fim da temporada o encadeamento pula para o primeiro episódio da
    // seguinte: antes a reprodução simplesmente parava ali.
    const sameSeason = episodes.find((e) => e.n === n + 1);
    let next: { season: number; episode: Episode } | null = null;
    if (sameSeason) {
      next = { season, episode: sameSeason };
    } else if (season < (media.seasons ?? 1)) {
      const opener = getEpisodes(media, season + 1)[0];
      if (opener) next = { season: season + 1, episode: opener };
    }

    return {
      mode: 'ep',
      media,
      season,
      episode,
      next,
      upNext: episodes.filter((e) => e.n > n).slice(0, 6),
    };
  }

  if (kind === 'live' && a) {
    const channel = getChannel(Number(a));
    if (!channel) return null;
    return { mode: 'live', channel };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = resolve(slug);
  if (!data) return {};

  if (data.mode === 'live') return { title: `${data.channel.name} ao vivo` };
  if (data.mode === 'ep') {
    return { title: `${data.media.title}: T${data.season}:E${data.episode.n}` };
  }
  return { title: `Assistindo ${data.media.title}` };
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ trailer?: string }>;
}) {
  const { slug } = await params;
  const { trailer } = await searchParams;
  const data = resolve(slug);
  if (!data) notFound();

  // `?trailer=1` roda uma prévia curta: não entra na fila nem marca como assistido.
  // Quando houver arquivo de trailer de verdade, é aqui que ele é escolhido.
  return (
    <PlayerScreen
      data={data}
      isTrailer={trailer === '1' && data.mode !== 'live'}
      related={data.mode === 'live' ? [] : getRelated(data.media).slice(0, 8)}
    />
  );
}
