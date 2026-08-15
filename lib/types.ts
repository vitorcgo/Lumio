export type MediaType = 'movie' | 'series' | 'anime' | 'dorama' | 'turca';

export interface Media {
  id: number;
  type: MediaType;
  title: string;
  genre: string;
  year: number;
  /** 0–10 */
  rating: number;
  img: string;
  cast: string;
  synopsis: string;
  /** filmes */
  durMin?: number;
  /** séries/animes: duração média por episódio */
  epMin?: number;
  epCount?: number;
  seasons?: number;
  /** país de origem: usado pelos doramas */
  country?: string;
  /** emissora/plataforma original: usado pelos doramas */
  network?: string;
}

/** `Media` acrescido dos campos derivados usados pela UI. */
export interface MediaView extends Media {
  isSeries: boolean;
  durText: string;
  typeLabel: string;
  ratingText: string;
  hasImg: boolean;
  seasonsLabel: string;
  metaLine: string;
  /** matiz estável derivada do id, usada nos degradês de fallback */
  hue: number;
}

export interface Episode {
  n: number;
  name: string;
  desc: string;
  dur: number;
  thumb: string;
  hasThumb: boolean;
}

export interface Channel {
  id: number;
  name: string;
  cat: string;
  color: string;
  now: string;
  next: string;
  /** progresso do programa atual, 0–100 */
  prog: number;
}

export interface ContinueItem {
  /** 'm1' | 'e22-1-3' */
  key: string;
  id: number;
  kind: 'movie' | 'ep';
  season?: number;
  n?: number;
  /** 0–100 */
  progress: number;
}

export type Rating = 'up' | 'down';

export type SubtitleLang = 'Português' | 'English' | 'Español' | 'Desligado';
export type AudioTrack = 'Dublado' | 'Original' | 'Original + descrição';
export type Quality = '4K' | '1080p' | '720p' | 'Auto';
export type Speed = '0.5x' | '1x' | '1.5x' | '2x';
export type StageSize = 'cinema' | 'compacto';

/** Contexto de reprodução derivado da rota /watch/... */
export type PlayContext =
  | { type: 'movie'; id: number }
  | { type: 'ep'; id: number; season: number; n: number }
  | { type: 'live'; channelId: number };
