'use client';

import { VolumeHighIcon, VolumeLowIcon, VolumeMuteIcon } from '../icons';

/** Ícone conforme o nível: mudo, baixo, alto. */
function VolumeIcon({ volume, muted }: { volume: number; muted: boolean }) {
  if (muted || volume === 0) return <VolumeMuteIcon className="h-5 w-5" />;
  return volume < 50 ? <VolumeLowIcon className="h-5 w-5" /> : <VolumeHighIcon className="h-5 w-5" />;
}

interface VolumeSliderProps {
  volume: number;
  muted: boolean;
  onChange: (volume: number) => void;
  onToggleMute: () => void;
}

export function VolumeSlider({ volume, muted, onChange, onToggleMute }: VolumeSliderProps) {
  const effective = muted ? 0 : volume;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggleMute}
        aria-pressed={muted}
        aria-label={muted ? 'Ativar som' : 'Silenciar'}
        title={muted ? 'Ativar som' : 'Silenciar'}
        className="grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-white/10"
      >
        <VolumeIcon volume={volume} muted={muted} />
      </button>

      {/* No celular fica só o botão de mudo: a barra não cabe junto do resto. */}
      <label className="relative hidden items-center sm:flex">
        <span className="sr-only">Volume</span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/25"
        >
          <span
            className="block h-full rounded-full bg-amber-soft"
            style={{ width: `${effective}%` }}
          />
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={effective}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative h-4 w-[84px] cursor-pointer appearance-none bg-transparent
            [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
        />
      </label>

      {/* Largura fixa e tabular-nums: o número muda sem empurrar os controles ao lado. */}
      <span className="hidden w-9 shrink-0 text-right text-[12px] font-semibold tabular-nums text-white/70 sm:block">
        {effective}%
      </span>
    </div>
  );
}
