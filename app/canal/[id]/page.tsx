import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { Particles } from '@/components/Particles';
import { ChannelCard } from '@/components/Live/ChannelCard';
import { ChannelLogo, LiveBadge } from '@/components/Live/ChannelLogo';
import { ChannelSchedule } from '@/components/Live/ChannelSchedule';
import { ArrowLeftIcon, PlayIcon } from '@/components/icons';
import { getChannel, getSiblingChannels } from '@/lib/catalog';
import { CHANNELS } from '@/lib/data';

export function generateStaticParams() {
  return CHANNELS.map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const channel = getChannel(Number(id));
  if (!channel) return {};
  return {
    title: channel.name,
    description: `Programação de ${channel.name} na Lumio. No ar agora: ${channel.now}.`,
  };
}

export default async function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const channel = getChannel(Number(id));
  if (!channel) notFound();

  const siblings = getSiblingChannels(channel);

  return (
    <>
      <section className="relative -mt-16 overflow-hidden pt-24 pb-10 lg:-mt-[76px] lg:pt-32">
        {/* O fundo assume a cor do canal, que é a única identidade visual que ele tem. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 15% 0%, ${channel.color}44, transparent 62%), linear-gradient(180deg, #0d0d13, #08080c)`,
          }}
        />
        <Particles count={8} />

        <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            TV Ao Vivo
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-7">
            <div className="motion-safe:animate-rise">
              <ChannelLogo channel={channel} />
            </div>

            <div className="min-w-0 flex-1 motion-safe:animate-rise" style={{ animationDelay: '60ms' }}>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-[30px] font-bold -tracking-[.02em] sm:text-[40px]">
                  {channel.name}
                </h1>
                <LiveBadge />
              </div>
              <p className="mt-1 text-sm text-white/50">{channel.cat}</p>
            </div>
          </div>

          <div
            className="mt-7 max-w-[620px] motion-safe:animate-rise"
            style={{ animationDelay: '120ms' }}
          >
            <p className="text-[11px] font-extrabold tracking-[.14em] text-white/40 uppercase">
              No ar agora
            </p>
            <p className="mt-1.5 font-display text-[24px] leading-tight font-bold sm:text-[30px]">
              {channel.now}
            </p>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/12">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-hi to-amber-mid motion-safe:bar-fill"
                style={{ width: `${channel.prog}%` }}
              />
            </div>
            <p className="mt-2 text-[13px] text-white/45">A seguir: {channel.next}</p>

            <Link
              href={`/watch/live/${channel.id}`}
              className="mt-6 inline-flex h-[52px] items-center gap-2.5 rounded-xl bg-gradient-to-br from-amber-hi to-amber-mid px-7 font-display text-[16px] font-bold text-night shadow-[0_12px_30px_rgba(255,190,26,.4)] transition-transform hover:scale-[1.03] motion-reduce:hover:scale-100"
            >
              <PlayIcon className="h-[18px] w-[18px]" />
              Assistir ao vivo
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-10">
        <h2 className="mb-4 font-display text-xl font-bold sm:text-[22px]">Programação de hoje</h2>
        <div className="max-w-[760px]">
          <ChannelSchedule channel={channel} />
        </div>
      </section>

      {siblings.length > 0 ? (
        <section className="mx-auto max-w-[1240px] px-4 pb-12 sm:px-6 lg:px-10">
          <h2 className="mb-4 font-display text-xl font-bold sm:text-[22px]">
            Outros canais de {channel.cat}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-[18px]">
            {siblings.map((c) => (
              <li key={c.id}>
                <ChannelCard channel={c} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Footer />
    </>
  );
}
