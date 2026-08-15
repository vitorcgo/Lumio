import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { EpisodeList } from '@/components/EpisodeList';
import { Footer } from '@/components/Footer';
import { PosterImage } from '@/components/PosterImage';
import { RelatedRow } from '@/components/RelatedRow';
import { TitleActions } from '@/components/TitleActions';
import { TitleDetails } from '@/components/TitleDetails';
import { StarIcon } from '@/components/icons';
import { CATALOG, getMedia, getRelated } from '@/lib/catalog';
import { backdropGradient } from '@/lib/format';

export function generateStaticParams() {
  return CATALOG.map((m) => ({ id: String(m.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const media = getMedia(Number(id));
  if (!media) return {};
  return {
    title: media.title,
    description: media.synopsis,
  };
}

export default async function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = getMedia(Number(id));
  if (!media) notFound();

  const related = getRelated(media);

  return (
    <>
      <section className="relative -mt-16 overflow-hidden sm:-mt-[76px]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: backdropGradient(media.hue) }}
        />
        {media.img ? (
          <Image
            src={media.img}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_16%]"
          />
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-night via-night/88 via-40% to-night/55 sm:bg-gradient-to-r sm:from-night/97 sm:via-night/80 sm:via-45% sm:to-night/55"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-night sm:h-[220px]"
        />

        <div className="relative mx-auto flex max-w-[1240px] flex-col gap-6 px-4 pt-24 pb-10 sm:flex-row sm:gap-11 sm:px-6 sm:pt-[140px] lg:px-10">
          {/* No celular o pôster fica centrado; a partir de sm ele volta para a coluna da esquerda. */}
          <div className="relative mx-auto shrink-0 sm:mx-0">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[32px] opacity-60 blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(255,190,26,.22), transparent 70%)',
              }}
            />
            <div className="relative aspect-2/3 w-[190px] overflow-hidden rounded-2xl border border-white/12 bg-surface-2 shadow-[0_30px_70px_rgba(0,0,0,.7)] sm:w-[270px] lg:w-[340px]">
              <PosterImage
                src={media.img}
                alt={`Pôster de ${media.title}`}
                hue={media.hue}
                sizes="(max-width: 639px) 190px, (max-width: 1023px) 270px, 340px"
              />
            </div>
          </div>

          <div className="max-w-[680px] flex-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber/45 bg-amber/16 px-3 py-1.5 text-xs font-bold tracking-[.14em] text-amber-soft uppercase">
              {media.typeLabel} · {media.genre}
            </p>

            <h1 className="mt-4 font-display text-[32px] leading-[1.03] font-bold -tracking-[.02em] text-balance sm:text-[42px] lg:text-[50px]">
              {media.title}
            </h1>

            <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 font-display font-bold whitespace-nowrap text-amber">
                <StarIcon className="h-4 w-4" />
                {media.ratingText}
              </span>
              <span aria-hidden="true" className="text-white/50">
                ·
              </span>
              <span className="text-white/80">{media.year}</span>
              <span aria-hidden="true" className="text-white/50">
                ·
              </span>
              <span className="text-white/80">{media.durText}</span>
              <span className="rounded-md border border-white/25 px-2 py-0.5 text-[11px] font-bold text-white/80">
                4K HDR
              </span>
              <span className="rounded-md border border-white/25 px-2 py-0.5 text-[11px] font-bold text-white/80">
                Dublado · Legendado
              </span>
            </div>

            <p className="mt-4 text-[16px] leading-relaxed text-pretty text-white/82 sm:text-[17px]">
              {media.synopsis}
            </p>

            <p className="mt-4 text-sm text-white/50">
              Elenco: <span className="text-white/82">{media.cast}</span>
            </p>

            <TitleActions media={media} />
          </div>
        </div>
      </section>

      {media.isSeries ? <EpisodeList media={media} /> : null}

      <TitleDetails
        media={media}
        className="mx-auto max-w-[1100px] px-4 pt-6 pb-10 sm:px-6 lg:px-10"
      />

      <RelatedRow items={related} />

      <Footer />
    </>
  );
}
