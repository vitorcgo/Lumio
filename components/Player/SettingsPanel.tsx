'use client';

import type { Preferences } from '@/lib/store';
import type { AudioTrack, Quality, Speed, SubtitleLang } from '@/lib/types';

const SUBTITLES: SubtitleLang[] = ['Português', 'English', 'Español', 'Desligado'];
const AUDIO: AudioTrack[] = ['Dublado', 'Original', 'Original + descrição'];
const QUALITY: Quality[] = ['4K', '1080p', '720p', 'Auto'];
const SPEED: Speed[] = ['0.5x', '1x', '1.5x', '2x'];

interface SettingsPanelProps {
  prefs: Preferences;
  onChange: (patch: Partial<Preferences>) => void;
}

function Group<T extends string>({
  label,
  options,
  current,
  onPick,
}: {
  label: string;
  options: readonly T[];
  current: T;
  onPick: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <p className="px-3 pt-2.5 pb-1.5 text-[11px] font-extrabold tracking-[.12em] text-white/45 uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5 px-2.5 pb-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            aria-pressed={option === current}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
              option === current
                ? 'bg-gradient-to-br from-amber-hi to-amber-mid text-night'
                : 'bg-white/8 text-white/85 hover:bg-white/16'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsPanel({ prefs, onChange }: SettingsPanelProps) {
  return (
    <div
      role="dialog"
      aria-label="Configurações de reprodução"
      className="absolute right-4 bottom-24 z-15 w-[280px] rounded-2xl border border-white/12 bg-[#0e0e14]/97 p-2 shadow-[0_24px_60px_rgba(0,0,0,.65)]"
    >
      <Group
        label="Legendas"
        options={SUBTITLES}
        current={prefs.sub}
        onPick={(sub) => onChange({ sub, subsOn: sub !== 'Desligado' })}
      />
      <Group
        label="Áudio"
        options={AUDIO}
        current={prefs.audio}
        onPick={(audio) => onChange({ audio })}
      />
      <Group
        label="Qualidade"
        options={QUALITY}
        current={prefs.quality}
        onPick={(quality) => onChange({ quality })}
      />
      <Group
        label="Velocidade"
        options={SPEED}
        current={prefs.speed}
        onPick={(speed) => onChange({ speed })}
      />
    </div>
  );
}
