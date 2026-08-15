import { formatRuntime } from '@/lib/format';
import type { MediaView } from '@/lib/types';

interface Row {
  label: string;
  value: string;
}

/** Monta só as linhas que o título realmente tem. */
function buildRows(media: MediaView): Row[] {
  const rows: Row[] = [
    { label: 'Tipo', value: media.typeLabel },
    { label: 'Gênero', value: media.genre },
    { label: 'Lançamento', value: String(media.year) },
  ];

  if (media.isSeries) {
    const seasons = media.seasons ?? 1;
    const perSeason = media.epCount ?? 0;
    rows.push({
      label: 'Temporadas',
      value: `${seasons} ${seasons > 1 ? 'temporadas' : 'temporada'} · ${perSeason} eps cada`,
    });
    rows.push({ label: 'Total de episódios', value: `${seasons * perSeason} episódios` });
    if (media.epMin) rows.push({ label: 'Duração média', value: `${media.epMin} min por episódio` });
  } else if (media.durMin) {
    rows.push({ label: 'Duração', value: formatRuntime(media.durMin) });
  }

  rows.push({ label: 'Avaliação', value: `${media.ratingText} de 10` });

  if (media.country) rows.push({ label: 'País de origem', value: media.country });
  if (media.network) rows.push({ label: 'Produção', value: media.network });

  rows.push({ label: 'Elenco', value: media.cast });
  rows.push({ label: 'Áudio', value: 'Dublado, Original' });
  rows.push({ label: 'Legendas', value: 'Português, English, Español' });
  rows.push({ label: 'Qualidade', value: '4K HDR · Dolby Atmos' });

  return rows;
}

/**
 * Ficha técnica do título. Usada tanto no detalhe quanto embaixo do player,
 * para quem quer saber mais sem sair da reprodução.
 */
export function TitleDetails({
  media,
  className = '',
}: {
  media: MediaView;
  className?: string;
}) {
  const rows = buildRows(media);

  return (
    <section className={className}>
      <h2 className="mb-4 font-display text-xl font-bold sm:text-[22px]">Detalhes</h2>
      <dl className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-0.5 border-b border-white/6 py-3 sm:flex-row sm:gap-4 sm:py-3.5"
          >
            <dt className="shrink-0 text-[13px] text-white/45 sm:w-[130px]">{row.label}</dt>
            <dd className="text-[14px] text-pretty text-white/85">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
