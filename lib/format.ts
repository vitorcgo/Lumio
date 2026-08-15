import type { Media } from './types';

/** Indexação modular segura: evita `undefined` sob `noUncheckedIndexedAccess`. */
export function pickFrom<T>(arr: readonly T[], i: number): T {
  const len = arr.length;
  if (len === 0) throw new Error('pickFrom: array vazio');
  return arr[((i % len) + len) % len] as T;
}

/** Matiz estável derivada do id, base de todos os degradês de fallback. */
export function hueFor(id: number): number {
  return (id * 47) % 360;
}

/** Degradê usado no lugar do pôster quando a imagem falta ou falha ao carregar. */
export function tileGradient(hue: number): string {
  return `linear-gradient(155deg, hsl(${hue} 52% 22%), hsl(${(hue + 40) % 360} 60% 9%))`;
}

/**
 * Miniatura embutida usada como `blurDataURL` do `next/image`.
 *
 * É o mesmo degradê do fallback, como SVG de 8x12 em base64: some o pop-in do
 * pôster entrando de uma vez, sem nenhuma requisição extra.
 */
export function tileBlurDataURL(hue: number): string {
  const from = `hsl(${hue} 52% 22%)`;
  const to = `hsl(${(hue + 40) % 360} 60% 9%)`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
    `</linearGradient></defs><rect width="8" height="12" fill="url(#g)"/></svg>`;

  // `toBase64` do Node não existe no cliente; `btoa` basta para ASCII puro.
  const encoded =
    typeof window === 'undefined'
      ? Buffer.from(svg).toString('base64')
      : window.btoa(svg);

  return `data:image/svg+xml;base64,${encoded}`;
}

/** Degradê de fundo para heros sem imagem. */
export function backdropGradient(hue: number): string {
  return `radial-gradient(110% 130% at 14% 22%, hsl(${hue} 50% 20%), transparent 58%), linear-gradient(120deg,#101018,#07070b)`;
}

/** Degradê do palco do player quando não há imagem. */
export function stageGradient(hue: number): string {
  return `radial-gradient(90% 120% at 50% 30%, hsl(${hue} 48% 24%), hsl(${(hue + 40) % 360} 55% 7%))`;
}

/** `170` → `"2h 50min"` */
export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}h ${m}min`;
}

/** Segundos → `"1:23:45"` ou `"4:05"` */
export function formatClock(totalSeconds: number): string {
  const x = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(x / 3600);
  const m = Math.floor((x % 3600) / 60);
  const s = x % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${p(m)}:${p(s)}` : `${m}:${p(s)}`;
}

/** Duração total de um título, em segundos, conforme o contexto de reprodução. */
export function totalSecondsFor(item: Media, isEpisode: boolean): number {
  const minutes = (isEpisode ? item.epMin : item.durMin) ?? 45;
  return minutes * 60;
}

/** Rótulo curto do canal para o quadrado do logo. */
export function shortChannelName(name: string): string {
  return name.length > 9 ? name.slice(0, 8) : name;
}

/** Chave estável de um item da fila "Continuar assistindo". */
export function continueKey(
  kind: 'movie' | 'ep',
  id: number,
  season?: number,
  n?: number,
): string {
  return kind === 'movie' ? `m${id}` : `e${id}-${season}-${n}`;
}
