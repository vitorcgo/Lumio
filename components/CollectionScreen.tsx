import { CollectionBackdrop } from './CollectionBackdrop';
import { CollectionCatalog } from './CollectionCatalog';
import { Footer } from './Footer';
import { Particles } from './Particles';
import { COUNTRY_CODE } from '@/lib/doramas';
import type { MediaView } from '@/lib/types';

interface CollectionScreenProps {
  items: MediaView[];
  genres: readonly string[];
  /** etiqueta pequena acima do título */
  badge: string;
  title: string;
  description: string;
  /** singular usado nas contagens */
  noun: string;
}

/**
 * Página de uma coleção: cabeçalho com números, filtros e grade.
 * Doramas e novelas turcas usam esta mesma casca.
 */
export function CollectionScreen({
  items,
  genres,
  badge,
  title,
  description,
  noun,
}: CollectionScreenProps) {
  const countries = [...new Set(items.map((d) => d.country).filter(Boolean))] as string[];
  const episodes = items.reduce((sum, d) => sum + (d.seasons ?? 1) * (d.epCount ?? 0), 0);
  const topRated = [...items].sort((a, b) => b.rating - a.rating)[0];

  const stats = [
    { value: String(items.length), label: 'títulos no catálogo' },
    { value: String(episodes), label: 'episódios disponíveis' },
    { value: String(countries.length), label: countries.length === 1 ? 'país de origem' : 'países de origem' },
    { value: topRated ? topRated.ratingText : ',', label: 'melhor nota' },
  ];

  return (
    <>
      <div className="min-h-[80vh] pb-10">
        <header className="relative -mt-16 overflow-hidden px-4 pt-24 pb-2 sm:px-6 lg:-mt-[76px] lg:px-10 lg:pt-32">
          <CollectionBackdrop items={items} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-20 h-[420px] w-[420px] rounded-full blur-[70px]"
            style={{
              background: 'radial-gradient(circle, rgba(255,190,26,.14), transparent 68%)',
            }}
          />
          <Particles count={10} />

          <p className="relative inline-flex items-center gap-2 rounded-full border border-amber/45 bg-amber/16 px-3 py-1.5 text-xs font-bold tracking-[.14em] text-amber-soft uppercase">
            {badge}
          </p>

          <h1 className="relative mt-4 font-display text-[32px] font-bold -tracking-[.02em] sm:text-[44px]">
            {title}
          </h1>

          <p className="relative mt-3 max-w-[680px] text-[15px] leading-relaxed text-pretty text-white/60 sm:text-[16px]">
            {description}
          </p>

          <p className="relative mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/50">
            {countries.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5">
                <span className="rounded border border-amber/35 bg-amber/12 px-1.5 py-px text-[10px] font-bold tracking-wider text-amber-soft">
                  {COUNTRY_CODE[c] ?? ','}
                </span>
                {c}
              </span>
            ))}
          </p>

          <dl className="relative mt-7 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/8 bg-surface/70 px-4 py-3.5 transition-colors hover:border-amber/35"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-bold text-amber-soft">
                    {s.value}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-tight text-white/50">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="mt-10">
          <CollectionCatalog items={items} genres={genres} noun={noun} />
        </div>
      </div>
      <Footer />
    </>
  );
}
