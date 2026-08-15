'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { ContinueCard, MediaCard, SoonCard } from './MediaCard';
import { RowScroller, SectionHeading } from './MediaRow';
import { Reveal } from './Reveal';
import { PlayIcon } from './icons';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import { useHydrated } from '@/hooks/useHydrated';
import { useRatings } from '@/hooks/useRatings';
import { useReminders } from '@/hooks/useReminders';
import { buildHomeRows } from '@/lib/rows';
import { useUserStore } from '@/lib/store';
import { toast } from '@/lib/toast';

const CARD_WIDTH = 'w-[132px] sm:w-[160px] lg:w-[196px]';

/**
 * Fileiras da Home que dependem do estado do usuário.
 *
 * Antes da hidratação isto renderiza os valores padrão da store: os mesmos que
 * o servidor gerou ,, então o HTML bate e nada pisca fora de lugar.
 */
export function HomeRows() {
  const { entries, remove, restore } = useContinueWatching();
  const { ratings } = useRatings();
  const watched = useUserStore((s) => s.watched);
  const { has: isReminded, toggle: toggleRemind } = useReminders();
  const hydrated = useHydrated();

  const rows = useMemo(() => buildHomeRows({ ratings, watched }), [ratings, watched]);

  return (
    <>
      {entries.length === 0 && hydrated ? (
        <Reveal className="mt-9">
          <section>
            <SectionHeading className="px-4 pb-4 sm:px-6 lg:px-10">
              Continuar assistindo
            </SectionHeading>
            {/* Sem isto a fileira inteira sumia sem explicação quando o usuário
                tirava o último item da fila. */}
            <div className="px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-white/12 bg-surface/40 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div>
                  <p className="font-display text-lg font-bold">Nada em andamento</p>
                  <p className="mt-1 max-w-[460px] text-sm text-white/55">
                    O que você começar a assistir aparece aqui, com o progresso guardado neste
                    aparelho.
                  </p>
                </div>
                <Link
                  href="/browse/movie"
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-br from-amber-hi to-amber-mid px-5 font-display text-[15px] font-bold text-night"
                >
                  <PlayIcon className="h-4 w-4" />
                  Explorar títulos
                </Link>
              </div>
            </div>
          </section>
        </Reveal>
      ) : null}

      {entries.length > 0 ? (
        <Reveal className="mt-9">
          <section>
            <SectionHeading className="px-4 pb-4 sm:px-6 lg:px-10">
              Continuar assistindo
            </SectionHeading>
            <RowScroller label="Continuar assistindo">
              {entries.map(({ entry, media, href, label }, i) => (
                <li key={entry.key} className={`snap-item shrink-0 ${CARD_WIDTH}`}>
                  <ContinueCard
                    media={media}
                    href={href}
                    progress={entry.progress}
                    label={label}
                    onRemove={() => {
                      remove(entry.key);
                      toast(`"${media.title}" saiu de Continuar assistindo.`, {
                        label: 'Desfazer',
                        run: () => restore(entry, i),
                      });
                    }}
                  />
                </li>
              ))}
            </RowScroller>
          </section>
        </Reveal>
      ) : null}

      {rows.map((row) => (
        <Reveal key={row.id} className="mt-9">
          <section>
            <SectionHeading className="px-4 pb-4 sm:px-6 lg:px-10">{row.title}</SectionHeading>
            <RowScroller label={row.title}>
              {row.items.map((item) => (
                <li key={item.media.id} className={`snap-item shrink-0 ${CARD_WIDTH}`}>
                  {item.soonLabel ? (
                    <SoonCard
                      media={item.media}
                      soonLabel={item.soonLabel}
                      reminded={isReminded(item.media.id)}
                      onToggle={() => {
                        const on = !isReminded(item.media.id);
                        toggleRemind(item.media.id);
                        toast(
                          on
                            ? `Você será avisado quando "${item.media.title}" estrear.`
                            : `Lembrete de "${item.media.title}" cancelado.`,
                        );
                      }}
                    />
                  ) : (
                    <MediaCard
                      media={item.media}
                      isNew={item.isNew}
                      watched={item.watched}
                      progress={item.progress}
                    />
                  )}
                </li>
              ))}
            </RowScroller>
          </section>
        </Reveal>
      ))}
    </>
  );
}
