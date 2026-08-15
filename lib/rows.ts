import { CATALOG, getMedia, pickMedia } from './catalog';
import { COMING_SOON } from './data';
import type { MediaView, Rating } from './types';

export interface RowItem {
  media: MediaView;
  /** 0–100; desenha a barra de progresso no rodapé do card */
  progress?: number;
  /** data de estreia; transforma o card num botão "Lembrar-me" */
  soonLabel?: string;
  isNew?: boolean;
  watched?: boolean;
}

export interface Row {
  id: string;
  title: string;
  items: RowItem[];
}

interface BuildOptions {
  ratings: Record<number, Rating>;
  watched: readonly number[];
}

const NEW_IN_BROWSE = [21, 46, 48, 9, 11];

export function isNewInBrowse(id: number): boolean {
  return NEW_IN_BROWSE.includes(id);
}

/**
 * Monta as fileiras da Home. Títulos avaliados como "não gostei" somem das
 * recomendações, e cada "gostei" gera uma fileira "Porque você curtiu …" do mesmo gênero.
 */
export function buildHomeRows({ ratings, watched }: BuildOptions): Row[] {
  const entries = Object.entries(ratings);
  const liked = entries.filter(([, v]) => v === 'up').map(([k]) => Number(k));
  const disliked = new Set(entries.filter(([, v]) => v === 'down').map(([k]) => Number(k)));

  const notDown = (arr: MediaView[]): MediaView[] => arr.filter((x) => !disliked.has(x.id));
  const toItems = (
    arr: MediaView[],
    decorate?: (m: MediaView) => Partial<RowItem>,
  ): RowItem[] =>
    arr.map((media) => ({
      media,
      watched: watched.includes(media.id),
      ...decorate?.(media),
    }));

  const rows: Row[] = [];

  // Fileira gerada pela avaliação positiva mais recente.
  const lastLikedId = liked.at(-1);
  if (lastLikedId !== undefined) {
    const seed = getMedia(lastLikedId);
    if (seed) {
      const items = notDown(
        CATALOG.filter(
          (x) => x.genre === seed.genre && !liked.includes(x.id) && x.id !== seed.id,
        ),
      ).slice(0, 8);
      if (items.length) {
        rows.push({
          id: 'liked',
          title: `Porque você curtiu ${seed.title}`,
          items: toItems(items),
        });
      }
    }
  }

  rows.push({
    id: 'originals',
    title: 'Só na Lumio · Originais',
    items: toItems(notDown(pickMedia([1, 3, 21, 41, 23, 47])), (m) => ({
      isNew: m.id === 21 || m.id === 47,
    })),
  });

  rows.push({
    id: 'movies',
    title: 'Filmes em destaque',
    items: toItems(notDown(pickMedia([4, 10, 8, 9, 12, 5, 7]))),
  });

  rows.push({
    id: 'series',
    title: 'Séries imperdíveis',
    items: toItems(notDown(pickMedia([22, 27, 23, 28, 24, 26]))),
  });

  rows.push({
    id: 'anime',
    title: 'Animes em alta',
    items: toItems(notDown(pickMedia([41, 42, 43, 46, 45, 47, 48])), (m) => ({
      isNew: m.id === 46 || m.id === 48,
    })),
  });

  rows.push({
    id: 'doramas',
    title: 'Doramas em alta',
    items: toItems(
      notDown(CATALOG.filter((x) => x.type === 'dorama'))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8),
    ),
  });

  rows.push({
    id: 'turcas',
    title: 'Novelas turcas em alta',
    items: toItems(
      notDown(CATALOG.filter((x) => x.type === 'turca'))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8),
    ),
  });

  rows.push({
    id: 'recent',
    title: 'Adicionados recentemente',
    items: toItems(notDown(pickMedia([9, 11, 46, 48, 7])), () => ({ isNew: true })),
  });

  rows.push({
    id: 'because-interstellar',
    title: 'Porque você assistiu Interestelar',
    items: toItems(notDown(CATALOG.filter((x) => x.genre === 'Sci-Fi' && x.id !== 10)).slice(0, 7)),
  });

  rows.push({
    id: 'trending-br',
    title: 'Em alta no Brasil',
    items: toItems(notDown(pickMedia([22, 4, 21, 44, 10, 28, 41]))),
  });

  rows.push({
    id: 'coming-soon',
    title: 'Chegando em breve',
    items: COMING_SOON.map(([id, date]): RowItem | null => {
      const media = getMedia(id);
      return media ? { media, soonLabel: date } : null;
    }).filter((x): x is RowItem => x !== null),
  });

  return rows.filter((r) => r.items.length > 0);
}
