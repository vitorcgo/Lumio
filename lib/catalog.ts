import {
  CAPTIONS,
  CHANNELS,
  EPG_POOL,
  EP_DESCRIPTIONS,
  EP_NAMES,
  EP_STATE,
  LOCAL_POSTERS,
  RAW,
} from './data';
import { DORAMAS } from './doramas';
import { formatRuntime, hueFor, pickFrom } from './format';
import { TURCAS } from './turcas';
import type { Channel, Episode, MediaType, MediaView } from './types';

const TYPE_LABELS: Record<MediaType, string> = {
  movie: 'Filme',
  series: 'Série',
  anime: 'Anime',
  dorama: 'Dorama',
  turca: 'Novela Turca',
};

/** Catálogo derivado: `RAW` + doramas + novelas turcas, com os campos que a UI consome. */
export const CATALOG: readonly MediaView[] = [...RAW, ...DORAMAS, ...TURCAS].map((r): MediaView => {
  const isSeries = r.type !== 'movie';
  const seasons = r.seasons ?? 1;
  const seasonWord = seasons > 1 ? 'temporadas' : 'temporada';
  const durText = isSeries ? `${seasons} ${seasonWord}` : formatRuntime(r.durMin ?? 0);
  const typeLabel = TYPE_LABELS[r.type];
  const ratingText = r.rating.toFixed(1);

  return {
    ...r,
    isSeries,
    durText,
    typeLabel,
    ratingText,
    hasImg: Boolean(r.img),
    hue: hueFor(r.id),
    seasonsLabel: isSeries ? `${seasons} ${seasonWord} · ${r.epCount} eps por temporada` : '',
    metaLine: isSeries
      ? `${r.year}  •  ${seasons} temporadas  •  Nota ${ratingText}  •  ${r.genre}`
      : `${r.year}  •  ${formatRuntime(r.durMin ?? 0)}  •  Nota ${ratingText}  •  ${r.genre}`,
  };
});

const BY_ID = new Map<number, MediaView>(CATALOG.map((m) => [m.id, m]));

export function getMedia(id: number): MediaView | undefined {
  return BY_ID.get(id);
}

/** Resolve uma lista de ids para itens do catálogo, ignorando ids desconhecidos. */
export function pickMedia(ids: readonly number[]): MediaView[] {
  return ids.map((id) => BY_ID.get(id)).filter((m): m is MediaView => m !== undefined);
}

export function getByType(type: MediaType): MediaView[] {
  return CATALOG.filter((m) => m.type === type);
}

/**
 * Destaques do hero, garantindo que todos tenham arte de fundo.
 *
 * O hero ocupa a tela inteira: um título sem imagem vira um retângulo preto.
 * Os ids preferidos são mantidos e, se algum ainda estiver sem pôster, a lista
 * é completada pelos mais bem avaliados que têm. Assim que o arquivo aparecer
 * em `public/posters/`, o preferido volta sozinho.
 */
export function getHeroItems(preferredIds: readonly number[], count = 4): MediaView[] {
  const preferred = pickMedia(preferredIds).filter((m) => m.hasImg);
  if (preferred.length >= count) return preferred.slice(0, count);

  const chosen = new Set(preferred.map((m) => m.id));
  const fill = CATALOG.filter((m) => m.hasImg && !chosen.has(m.id)).sort(
    (a, b) => b.rating - a.rating,
  );

  return [...preferred, ...fill].slice(0, count);
}

/** Rota do player que começa o título do início. */
export function playHrefFor(media: MediaView): string {
  return media.type === 'movie' ? `/watch/movie/${media.id}` : `/watch/ep/${media.id}/1/1`;
}

const CHANNELS_BY_ID = new Map<number, Channel>(CHANNELS.map((c) => [c.id, c]));

export function getChannel(id: number): Channel | undefined {
  return CHANNELS_BY_ID.get(id);
}

/** Demais canais da mesma categoria, para sugerir na página do canal. */
export function getSiblingChannels(channel: Channel, limit = 8): Channel[] {
  const same = CHANNELS.filter((c) => c.cat === channel.cat && c.id !== channel.id);
  if (same.length >= limit) return same.slice(0, limit);
  const rest = CHANNELS.filter((c) => c.cat !== channel.cat && c.id !== channel.id);
  return [...same, ...rest].slice(0, limit);
}

/**
 * Programação do canal a partir de uma hora base.
 *
 * `baseHour` vem do cliente: a hora atual não existe no servidor sem quebrar a
 * hidratação, então quem chama decide quando calcular.
 */
export function getSchedule(
  channel: Channel,
  baseHour: number,
  slots = 6,
): { time: string; name: string; live: boolean }[] {
  return Array.from({ length: slots }, (_, i) => ({
    time: `${String((baseHour + i) % 24).padStart(2, '0')}:00`,
    name:
      i === 0 ? channel.now : i === 1 ? channel.next : pickFrom(EPG_POOL, channel.id + i * 2),
    live: i === 0,
  }));
}

const episodeCache = new Map<string, readonly Episode[]>();

/**
 * Gera os episódios de uma temporada a partir de `EP_NAMES` / `EP_DESCRIPTIONS`,
 * exatamente como o protótipo: tudo é determinístico a partir de `id`, `season` e `n`.
 */
export function getEpisodes(item: MediaView, season: number): readonly Episode[] {
  const cacheKey = `${item.id}-${season}`;
  const cached = episodeCache.get(cacheKey);
  if (cached) return cached;

  const count = item.epCount ?? 0;
  const list: Episode[] = [];
  for (let n = 1; n <= count; n += 1) {
    const thumb = item.img || pickFrom(LOCAL_POSTERS, item.id + season * 3 + n);
    const dur = (item.epMin ?? 45) + ((item.id + n * 7) % 14) - 4;
    list.push({
      n,
      name: pickFrom(EP_NAMES, item.id + n),
      desc: pickFrom(EP_DESCRIPTIONS, item.id + n * 5),
      dur: Math.max(20, dur),
      thumb,
      hasThumb: Boolean(item.img),
    });
  }

  episodeCache.set(cacheKey, list);
  return list;
}

export function getEpisode(item: MediaView, season: number, n: number): Episode | undefined {
  return getEpisodes(item, season).find((e) => e.n === n);
}

/** Progresso pré-existente (0–100) de um episódio, vindo de `EP_STATE`. */
export function seededEpisodeProgress(id: number, season: number, n: number): number {
  return EP_STATE[`${id}-${season}-${n}`] ?? 0;
}

/** Legenda exibida no player: varia por título. */
export function captionFor(id: number): string {
  return pickFrom(CAPTIONS, id);
}

/**
 * Relacionados: mesmo tipo e gênero primeiro; completa com o resto do catálogo
 * até dez itens, como no protótipo.
 */
export function getRelated(item: MediaView): MediaView[] {
  let related = CATALOG.filter(
    (x) => x.type === item.type && x.genre === item.genre && x.id !== item.id,
  );
  if (related.length < 6) {
    const extra = CATALOG.filter((x) => x.id !== item.id && !related.includes(x));
    related = [...related, ...extra];
  }
  return related.slice(0, 10);
}

/** Busca por título, gênero, tipo e elenco. */
export function searchCatalog(query: string, genre: string): MediaView[] {
  let matched: MediaView[] = [...CATALOG];
  if (genre !== 'Todos') matched = matched.filter((x) => x.genre === genre);

  const q = query.trim().toLowerCase();
  if (q) {
    matched = matched.filter((x) =>
      `${x.title} ${x.genre} ${x.typeLabel} ${x.cast}`.toLowerCase().includes(q),
    );
  }
  return matched;
}
