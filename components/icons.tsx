import type { SVGProps } from 'react';

/**
 * Conjunto de ícones da Lumio.
 *
 * Todos usam `currentColor` e viewBox 24×24, então herdam cor e tamanho do
 * contexto: o tamanho vem por classe (`h-5 w-5` por padrão). Nenhum emoji na
 * interface: emoji muda de desenho conforme o sistema e não aceita cor.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ className = 'h-5 w-5', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    />
  );
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function StarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.45 6.2 20.5l1.1-6.47-4.7-4.58 6.5-.95L12 2.6z"
        fill="currentColor"
      />
    </Icon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 4.5v15a1 1 0 001.53.85l12-7.5a1 1 0 000-1.7l-12-7.5A1 1 0 007 4.5z" fill="currentColor" />
    </Icon>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 4h3v16H8zM13 4h3v16h-3z" fill="currentColor" />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" {...stroke} />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 6L9 17l-5-5" {...stroke} />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 6L6 18M6 6l12 12" {...stroke} />
    </Icon>
  );
}

export function ThumbUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M7 22V11l4.5-8a2.5 2.5 0 013.5 2.3V9h4.2a2 2 0 011.96 2.4l-1.4 7A2 2 0 0117.8 20H7z"
        {...stroke}
      />
      <path d="M7 11H4a1 1 0 00-1 1v9a1 1 0 001 1h3" {...stroke} />
    </Icon>
  );
}

export function ThumbDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M17 2v11l-4.5 8A2.5 2.5 0 019 18.7V15H4.8a2 2 0 01-1.96-2.4l1.4-7A2 2 0 016.2 4H17z"
        {...stroke}
      />
      <path d="M17 13h3a1 1 0 001-1V3a1 1 0 00-1-1h-3" {...stroke} />
    </Icon>
  );
}

export function BellIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Icon {...props}>
      <path
        d="M18 8a6 6 0 10-12 0c0 5-2 6-2 6h16s-2-1-2-6z"
        {...stroke}
        fill={filled ? 'currentColor' : 'none'}
      />
      <path d="M13.7 20a2 2 0 01-3.4 0" {...stroke} />
    </Icon>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="18" cy="5" r="3" {...stroke} />
      <circle cx="6" cy="12" r="3" {...stroke} />
      <circle cx="18" cy="19" r="3" {...stroke} />
      <path d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2" {...stroke} />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" {...stroke} />
      <path d="M16.5 16.5L21 21" {...stroke} />
    </Icon>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 12a9 9 0 109-9 9 9 0 00-6.36 2.64L3 8" {...stroke} />
      <path d="M3 3v5h5M12 7v5l3.5 2" {...stroke} />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M12 11v5M12 8h.01" {...stroke} />
    </Icon>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3" {...stroke} />
      <path
        d="M19.4 15a1.6 1.6 0 00.32 1.77l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.6 1.6 0 00-1.77-.32 1.6 1.6 0 00-1 1.47V21a2 2 0 11-4 0v-.1A1.6 1.6 0 008.1 19.4a1.6 1.6 0 00-1.77.32l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.6 1.6 0 00.32-1.77 1.6 1.6 0 00-1.47-1H2a2 2 0 110-4h.1A1.6 1.6 0 004.6 8.1a1.6 1.6 0 00-.32-1.77l-.06-.06a2 2 0 112.83-2.83l.06.06a1.6 1.6 0 001.77.32H9a1.6 1.6 0 001-1.47V2a2 2 0 114 0v.1a1.6 1.6 0 001 1.47 1.6 1.6 0 001.77-.32l.06-.06a2 2 0 112.83 2.83l-.06.06a1.6 1.6 0 00-.32 1.77V9a1.6 1.6 0 001.47 1H22a2 2 0 110 4h-.1a1.6 1.6 0 00-1.47 1z"
        {...stroke}
      />
    </Icon>
  );
}

export function FullscreenIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" {...stroke} />
    </Icon>
  );
}

export function ExpandIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" {...stroke} />
    </Icon>
  );
}

export function CollapseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" {...stroke} />
    </Icon>
  );
}

export function VolumeMuteIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11 5L6 9H2v6h4l5 4V5z" {...stroke} />
      <path d="M22 9l-6 6M16 9l6 6" {...stroke} />
    </Icon>
  );
}

export function VolumeLowIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11 5L6 9H2v6h4l5 4V5z" {...stroke} />
      <path d="M15.5 8.5a5 5 0 010 7" {...stroke} />
    </Icon>
  );
}

export function VolumeHighIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11 5L6 9H2v6h4l5 4V5z" {...stroke} />
      <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" {...stroke} />
    </Icon>
  );
}

export function SkipForwardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 4l10 8-10 8V4z" fill="currentColor" />
      <path d="M19 5v14" {...stroke} />
    </Icon>
  );
}

export function Rewind10Icon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11 4A8 8 0 114 13" {...stroke} />
      <path d="M11 1L7.5 4 11 7" {...stroke} />
      <text
        x="12"
        y="17.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
      >
        10
      </text>
    </Icon>
  );
}

export function Forward10Icon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13 4a8 8 0 107 9" {...stroke} />
      <path d="M13 1l3.5 3L13 7" {...stroke} />
      <text
        x="12"
        y="17.5"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
      >
        10
      </text>
    </Icon>
  );
}

export function CaptionsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="3" {...stroke} />
      <path d="M9.5 10.5a2.5 2.5 0 100 3M16.5 10.5a2.5 2.5 0 100 3" {...stroke} />
    </Icon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18z" {...stroke} />
    </Icon>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" {...stroke} />
    </Icon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 5l-7 7 7 7" {...stroke} />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 5l7 7-7 7" {...stroke} />
    </Icon>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" {...stroke} />
    </Icon>
  );
}

export function FilmIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" {...stroke} />
      <path d="M7 4v16M17 4v16M2.5 12h19M2.5 8h4.5M2.5 16h4.5M17 8h4.5M17 16h4.5" {...stroke} />
    </Icon>
  );
}

export function TvIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="7" width="19" height="13" rx="2.5" {...stroke} />
      <path d="M8 3l4 4 4-4" {...stroke} />
    </Icon>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" {...stroke} />
      <path d="M18.5 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" {...stroke} />
    </Icon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 20.5l-1.4-1.3C5.6 14.9 2.5 12.1 2.5 8.6A4.6 4.6 0 017.1 4c1.7 0 3.3.8 4.9 2.6C13.6 4.8 15.2 4 16.9 4a4.6 4.6 0 014.6 4.6c0 3.5-3.1 6.3-8.1 10.6z"
        {...stroke}
      />
    </Icon>
  );
}

/** Máscaras de teatro: usado para a coleção de novelas. */
export function DramaIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 4.5h9v6a4.5 4.5 0 01-9 0z" {...stroke} />
      <path d="M5.6 7.5h.01M9.4 7.5h.01M5.8 10.4a2.4 2.4 0 003.4 0" {...stroke} />
      <path d="M12 6.5h9v6a4.5 4.5 0 01-9 0" {...stroke} />
      <path d="M14.6 9.5h.01M18.4 9.5h.01M14.8 13.4a2.4 2.4 0 003.4 0" {...stroke} />
    </Icon>
  );
}

export function BroadcastIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <path d="M8.2 8.2a5.4 5.4 0 000 7.6M15.8 15.8a5.4 5.4 0 000-7.6" {...stroke} />
      <path d="M5.3 5.3a9.5 9.5 0 000 13.4M18.7 18.7a9.5 9.5 0 000-13.4" {...stroke} />
    </Icon>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" {...stroke} />
    </Icon>
  );
}
