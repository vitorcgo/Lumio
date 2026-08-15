'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { EPG_POOL } from '@/lib/data';
import { pickFrom } from '@/lib/format';
import type { Channel } from '@/lib/types';

const SLOTS = [0, 1, 2, 3, 4];

function slotLabel(baseHour: number, offset: number): string {
  return `${String((baseHour + offset) % 24).padStart(2, '0')}:00`;
}

/**
 * Grade completa (EPG).
 *
 * A hora atual só existe no cliente, então o componente espera a montagem para
 * calcular as faixas: nunca renderiza um horário do servidor que não bateria.
 */
export function EpgGrid({ channels }: { channels: readonly Channel[] }) {
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  if (hour === null) {
    return (
      <div className="space-y-2.5" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skeleton h-[68px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* A grade é mais larga que a tela; sem essa dica ninguém descobre que
          dá para arrastar de lado. */}
      <p className="mb-2 flex items-center gap-1.5 text-[12px] text-white/40 lg:hidden">
        <span aria-hidden="true">↔</span>
        Arraste para ver as próximas faixas de horário
      </p>

      <div
        className="overflow-x-auto pb-3.5"
        style={{
          maskImage: 'linear-gradient(90deg,#000 92%,transparent)',
          WebkitMaskImage: 'linear-gradient(90deg,#000 92%,transparent)',
        }}
      >
        <div className="min-w-[840px]">
        <div className="mb-2.5 flex gap-2.5 pl-[196px]">
          {SLOTS.map((i) => (
            <div
              key={i}
              className="min-w-[150px] flex-1 text-xs font-extrabold tracking-[.08em] text-white/45"
            >
              {slotLabel(hour, i)}
            </div>
          ))}
        </div>

        <ul className="flex flex-col gap-2.5">
          {channels.map((channel) => {
            const programmes = [
              channel.now,
              channel.next,
              pickFrom(EPG_POOL, channel.id),
              pickFrom(EPG_POOL, channel.id + 3),
              pickFrom(EPG_POOL, channel.id + 5),
            ];

            return (
              <li key={channel.id} className="flex items-stretch gap-2.5">
                <Link
                  href={`/watch/live/${channel.id}`}
                  aria-label={`Assistir ${channel.name} ao vivo`}
                  className="flex flex-[0_0_186px] items-center gap-2.5 rounded-xl border border-white/7 bg-gradient-to-br from-surface-3 to-[#0d0d13] p-2.5 transition-colors hover:border-amber/50"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg font-display text-[11px] font-extrabold text-white"
                    style={{
                      backgroundImage: `linear-gradient(150deg, ${channel.color}, ${channel.color}99)`,
                    }}
                  >
                    {channel.name.slice(0, 3)}
                  </span>
                  <span className="min-w-0 truncate font-display text-sm font-bold">
                    {channel.name}
                  </span>
                </Link>

                {programmes.map((name, i) => (
                  <Link
                    key={i}
                    href={`/watch/live/${channel.id}`}
                    aria-label={`${name}, ${slotLabel(hour, i)} em ${channel.name}`}
                    className={`min-w-[150px] flex-1 rounded-[10px] border p-3 ${
                      i === 0
                        ? 'border-amber/40 bg-gradient-to-br from-amber-hi/16 to-amber-mid/6'
                        : 'border-white/7 bg-white/3 hover:border-white/20'
                    }`}
                  >
                    <span className="mb-1 block text-[11px] text-white/45">
                      {slotLabel(hour, i)}
                    </span>
                    <span
                      className={`block truncate text-sm ${
                        i === 0 ? 'font-bold text-amber-soft' : 'font-semibold text-white'
                      }`}
                    >
                      {name}
                    </span>
                  </Link>
                ))}
              </li>
            );
          })}
        </ul>
        </div>
      </div>
    </div>
  );
}

// Permite `import('./EpgGrid')` com default export no next/dynamic.
export default EpgGrid;
