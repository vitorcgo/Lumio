'use client';

import { useEffect, useState } from 'react';

import { getSchedule } from '@/lib/catalog';
import type { Channel } from '@/lib/types';

/**
 * Programação do canal.
 *
 * A hora atual só existe no cliente, então o componente espera a montagem para
 * calcular as faixas: renderizar um horário do servidor quebraria a hidratação.
 */
export function ChannelSchedule({ channel }: { channel: Channel }) {
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  if (hour === null) {
    return (
      <ul className="space-y-2.5" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="skeleton h-[62px] rounded-xl" />
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2.5">
      {getSchedule(channel, hour).map((slot, i) => (
        <li
          key={slot.time}
          className={`flex items-center gap-4 rounded-xl border p-3.5 transition-colors motion-safe:animate-slide-right ${
            slot.live
              ? 'border-amber/40 bg-gradient-to-r from-amber-hi/14 to-transparent'
              : 'border-white/7 bg-surface/60 hover:border-white/16'
          }`}
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <span
            className={`w-14 shrink-0 font-display text-[15px] font-bold tabular-nums ${
              slot.live ? 'text-amber' : 'text-white/45'
            }`}
          >
            {slot.time}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold text-white">
              {slot.name}
            </span>
            {slot.live ? (
              <span className="mt-0.5 block text-[12px] text-amber-soft">
                No ar agora · {channel.prog}% do programa
              </span>
            ) : null}
          </span>

          {slot.live ? (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#ff3c3c]/55 bg-[#ff2d2d]/20 px-2.5 py-1">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-live motion-safe:animate-pulse-live"
              />
              <span className="text-[10px] font-extrabold text-[#ff8a8a]">AO VIVO</span>
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
