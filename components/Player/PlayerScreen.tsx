'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CaptionTrack } from './CaptionTrack';
import { NextEpisodeOverlay } from './NextEpisodeOverlay';
import { SettingsPanel } from './SettingsPanel';
import { VolumeSlider } from './VolumeSlider';
import { PosterImage } from '../PosterImage';
import { RelatedRow } from '../RelatedRow';
import { TitleDetails } from '../TitleDetails';
import {
  ArrowLeftIcon,
  CaptionsIcon,
  CollapseIcon,
  ExpandIcon,
  Forward10Icon,
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
  InfoIcon,
  Rewind10Icon,
  SettingsIcon,
  SkipForwardIcon,
} from '../icons';
import { usePreferences } from '@/hooks/usePreferences';
import { captionFor, seededEpisodeProgress } from '@/lib/catalog';
import { continueKey, formatClock, stageGradient, totalSecondsFor } from '@/lib/format';
import { useUserStore } from '@/lib/store';
import type { Channel, Episode, MediaView } from '@/lib/types';


export type PlayerData =
  | { mode: 'movie'; media: MediaView }
  | {
      mode: 'ep';
      media: MediaView;
      season: number;
      episode: Episode;
      /** Próximo episódio: pode ser o primeiro da temporada seguinte. */
      next: { season: number; episode: Episode } | null;
      upNext: Episode[];
    }
  | { mode: 'live'; channel: Channel };

/** Avanço da simulação: 0,08% a cada 100 ms, como no protótipo. */
const TICK_MS = 100;
const TICK_STEP = 0.08;
const NEXT_COUNTDOWN = 6;

/** Duração de uma prévia, em segundos. */
const TRAILER_SECONDS = 150;

export function PlayerScreen({
  data,
  isTrailer = false,
  related = [],
}: {
  data: PlayerData;
  /** Modo prévia: não entra na fila, não marca como assistido, não encadeia episódio. */
  isTrailer?: boolean;
  /** Sugestões exibidas abaixo do player. */
  related?: MediaView[];
}) {
  const router = useRouter();
  const { prefs, setPrefs, setVolume, toggleMute } = usePreferences();
  const setContinueProgress = useUserStore((s) => s.setContinueProgress);

  const isLive = data.mode === 'live';
  const stageRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const contKey = useMemo(() => {
    if (data.mode === 'movie') return continueKey('movie', data.media.id);
    if (data.mode === 'ep') return continueKey('ep', data.media.id, data.season, data.episode.n);
    return null;
  }, [data]);

  const totalSeconds = isLive
    ? 0
    : isTrailer
      ? TRAILER_SECONDS
      : totalSecondsFor(data.media, data.mode === 'ep');

  // Entra na fila "Continuar assistindo" e retoma de onde parou.
  useEffect(() => {
    if (!contKey || isLive || isTrailer) return;
    const store = useUserStore.getState();
    const saved = store.cont.find((e) => e.key === contKey)?.progress;
    const seeded =
      data.mode === 'ep' ? seededEpisodeProgress(data.media.id, data.season, data.episode.n) : 0;

    // Um título já terminado recomeça do zero.
    const resumeAt = saved ?? seeded;
    const initial = resumeAt >= 100 ? 0 : resumeAt;

    setProgress(initial);
    setPlaying(true);
    setCountdown(0);
    store.touchContinue(
      data.mode === 'movie'
        ? { key: contKey, id: data.media.id, kind: 'movie', progress: initial }
        : {
            key: contKey,
            id: data.media.id,
            kind: 'ep',
            season: data.season,
            n: data.episode.n,
            progress: initial,
          },
    );
  }, [contKey, isLive, isTrailer, data]);

  // Enquanto a barra está sendo arrastada o relógio para, senão ele somaria
  // progresso por baixo do dedo e o marcador tremia.
  const [scrubbing, setScrubbing] = useState(false);

  // Relógio da reprodução.
  useEffect(() => {
    if (!playing || isLive || countdown > 0 || scrubbing) return;
    const rate = Number.parseFloat(prefs.speed) || 1;
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + TICK_STEP * rate));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, isLive, countdown, scrubbing, prefs.speed]);

  // Salva o progresso; `setContinueProgress` ignora valores repetidos.
  useEffect(() => {
    if (!contKey || isLive || isTrailer) return;
    setContinueProgress(contKey, progress);
  }, [contKey, isLive, isTrailer, progress, setContinueProgress]);

  // Fim do episódio/filme.
  useEffect(() => {
    if (isLive || progress < 100) return;
    setPlaying(false);
    if (isTrailer) return;
    useUserStore.getState().markWatched(data.media.id);
    if (data.mode === 'ep' && data.next) {
      // Os dois painéis ocupam o mesmo canto; o aviso do próximo episódio manda.
      setShowSettings(false);
      setCountdown(NEXT_COUNTDOWN);
    }
  }, [progress, isLive, isTrailer, data]);

  const goToNextEpisode = useCallback(() => {
    if (data.mode !== 'ep' || !data.next) return;
    setCountdown(0);
    router.push(`/watch/ep/${data.media.id}/${data.next.season}/${data.next.episode.n}`);
  }, [data, router]);

  // Contagem regressiva do próximo episódio.
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => {
      if (countdown === 1) goToNextEpisode();
      else setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [countdown, goToNextEpisode]);

  const seekBy = useCallback(
    (deltaSeconds: number) => {
      if (isLive || totalSeconds === 0) return;
      const step = (100 * deltaSeconds) / totalSeconds;
      setProgress((p) => Math.max(0, Math.min(100, p + step)));
    },
    [isLive, totalSeconds],
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen();
  }, []);

  // Os controles somem durante a reprodução e voltam ao menor movimento.
  const [chromeVisible, setChromeVisible] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wakeChrome = useCallback(() => {
    setChromeVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setChromeVisible(false), 2800);
  }, []);

  useEffect(() => {
    // Pausado, com menu aberto ou no fim: os controles ficam.
    if (!playing || showSettings || countdown > 0) {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      setChromeVisible(true);
      return;
    }
    wakeChrome();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [playing, showSettings, countdown, wakeChrome]);

  // Clique simples no palco alterna play/pause; duplo clique vai para tela cheia.
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onStageClick = useCallback(() => {
    if (isLive) return;
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      toggleFullscreen();
      return;
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      setPlaying((p) => !p);
    }, 220);
  }, [isLive, toggleFullscreen]);

  // Atalhos de teclado: espaço, setas, F, M.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement;
      if (typing) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          if (!isLive) setPlaying((p) => !p);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekBy(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekBy(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prefs.volume + 5);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prefs.volume - 5);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isLive, seekBy, setVolume, toggleMute, toggleFullscreen, prefs.volume]);

  const showSkipIntro = !isLive && !isTrailer && progress > 0.5 && progress < 14;
  const showCaption = !isLive && prefs.subsOn && prefs.sub !== 'Desligado';

  const title = isLive ? data.channel.now : data.media.title;
  const subtitle = isLive
    ? `${data.channel.name} · ${data.channel.cat}`
    : data.mode === 'ep'
      ? `Temporada ${data.season} · Episódio ${data.episode.n}: ${data.episode.name}`
      : data.media.metaLine;
  const synopsis = isLive
    ? `Transmissão ao vivo de ${data.channel.name}. A seguir: ${data.channel.next}.`
    : data.media.synopsis;

  const backHref = isLive ? '/live' : `/title/${data.media.id}`;
  const backLabel = isLive ? 'Voltar à TV ao vivo' : 'Voltar aos detalhes';

  const stageImage =
    data.mode === 'ep' ? data.episode.thumb : data.mode === 'movie' ? data.media.img : '';

  return (
    <div className="px-4 pt-7 pb-16 sm:px-6 lg:px-10">
      <div
        className="mx-auto transition-[max-width] duration-300"
        style={{ maxWidth: prefs.size === 'compacto' ? 720 : 1180 }}
      >
        <div
          ref={stageRef}
          onMouseMove={wakeChrome}
          onPointerDown={wakeChrome}
          className={`player-stage relative aspect-video overflow-hidden rounded-2xl border border-white/8 bg-black shadow-[0_30px_80px_rgba(0,0,0,.6)] ${
            chromeVisible ? '' : 'cursor-none'
          }`}
        >
          {/* Camada de clique: um toque pausa, dois vão para tela cheia. */}
          {!isLive ? (
            <button
              type="button"
              onClick={onStageClick}
              tabIndex={-1}
              aria-hidden="true"
              className="absolute inset-0 z-1 cursor-[inherit]"
            />
          ) : null}
          {isLive ? (
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: `radial-gradient(90% 120% at 50% 30%, ${data.channel.color}55, #07070b)`,
              }}
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ backgroundImage: stageGradient(data.media.hue) }}
            >
              <PosterImage
                src={stageImage}
                alt=""
                hue={data.media.hue}
                sizes="(max-width: 1023px) 100vw, 1180px"
                position="center 25%"
                priority
              />
            </div>
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_45%,rgba(0,0,0,.12),rgba(0,0,0,.55))]"
          />

          <div
            className={`absolute inset-x-0 top-0 z-2 flex flex-wrap items-center gap-3 bg-gradient-to-b from-black/60 to-transparent p-4 transition-opacity duration-300 sm:px-5 ${
              chromeVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff3c3c]/55 bg-[#ff2d2d]/20 px-2.5 py-1">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-live motion-safe:animate-pulse-live"
                />
                <span className="text-[11px] font-extrabold text-[#ff8a8a]">AO VIVO</span>
              </span>
            ) : isTrailer ? (
              <span className="rounded-full border border-amber/50 bg-amber/18 px-2.5 py-1 text-[11px] font-extrabold tracking-[.12em] text-amber-soft uppercase">
                Trailer
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-amber shadow-[0_0_10px_#ffc21a]"
                />
                <span className="text-[11px] tracking-[.12em] text-white/65 uppercase">
                  {playing ? 'Reproduzindo' : 'Pausado'}
                </span>
              </span>
            )}
            <p className="font-display text-[15px] font-bold sm:text-[16px]">{title}</p>
            <p className="hidden text-[13px] text-white/55 sm:block">{subtitle}</p>
          </div>

          {!isLive ? (
            <div
              className={`pointer-events-none absolute inset-0 z-2 grid place-items-center transition-opacity duration-300 ${
                chromeVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pausar' : 'Reproduzir'}
                className="pointer-events-auto grid h-[68px] w-[68px] place-items-center rounded-full border border-white/30 bg-black/42 backdrop-blur-[8px] transition-transform hover:scale-105 sm:h-[82px] sm:w-[82px] motion-reduce:hover:scale-100"
              >
                {playing ? (
                  <PauseIcon className="h-7 w-7 sm:h-8 sm:w-8" />
                ) : (
                  <PlayIcon className="ml-1 h-7 w-7 sm:h-8 sm:w-8" />
                )}
              </button>
            </div>
          ) : null}

          {showCaption ? <CaptionTrack text={captionFor(data.media.id)} /> : null}

          {showSkipIntro ? (
            <button
              type="button"
              onClick={() => setProgress(14)}
              className="absolute right-4 bottom-[104px] z-16 inline-flex items-center gap-2 rounded-[10px] border border-white/50 bg-black/72 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-night sm:right-6 sm:bottom-28"
            >
              Pular abertura
              <SkipForwardIcon className="h-4 w-4" />
            </button>
          ) : null}

          {countdown > 0 && data.mode === 'ep' && data.next ? (
            <NextEpisodeOverlay
              seconds={countdown}
              // Quando vira a temporada, o rótulo avisa: "T2:E1", não só "E1".
              title={
                data.next.season === data.season
                  ? `E${data.next.episode.n} · ${data.next.episode.name}`
                  : `T${data.next.season}:E${data.next.episode.n} · ${data.next.episode.name}`
              }
              heading={
                data.next.season === data.season ? 'Próximo episódio' : 'Próxima temporada'
              }
              thumb={data.next.episode.thumb}
              hue={data.media.hue}
              onPlayNow={goToNextEpisode}
              onCancel={() => setCountdown(0)}
            />
          ) : null}

          {showSettings ? <SettingsPanel prefs={prefs} onChange={setPrefs} /> : null}

          <div
            className={`absolute inset-x-0 bottom-0 z-2 bg-gradient-to-t from-black/82 to-transparent px-4 pt-4 pb-4 transition-opacity duration-300 sm:px-5 ${
              chromeVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            {!isLive ? (
              <label className="relative flex items-center">
                <span className="sr-only">Posição da reprodução</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/25"
                >
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-amber-hi to-amber-mid"
                    style={{ width: `${progress}%` }}
                  />
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  onPointerDown={() => setScrubbing(true)}
                  onPointerUp={() => setScrubbing(false)}
                  onPointerCancel={() => setScrubbing(false)}
                  onKeyDown={() => setScrubbing(true)}
                  onKeyUp={() => setScrubbing(false)}
                  onBlur={() => setScrubbing(false)}
                  aria-valuetext={`${formatClock((totalSeconds * progress) / 100)} de ${formatClock(totalSeconds)}`}
                  className="relative h-4 w-full cursor-pointer appearance-none bg-transparent
                    [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,.5)]
                    [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
                />
              </label>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2.5">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pausar' : 'Reproduzir'}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber text-night transition-transform hover:scale-105 motion-reduce:hover:scale-100"
              >
                {playing ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="ml-0.5 h-4 w-4" />
                )}
              </button>

              {!isLive ? (
                <>
                  <button
                    type="button"
                    onClick={() => seekBy(-10)}
                    aria-label="Voltar 10 segundos"
                    title="Voltar 10 segundos"
                    className="hidden h-8 w-8 place-items-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white min-[420px]:grid"
                  >
                    <Rewind10Icon className="h-[22px] w-[22px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => seekBy(10)}
                    aria-label="Avançar 10 segundos"
                    title="Avançar 10 segundos"
                    className="hidden h-8 w-8 place-items-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white min-[420px]:grid"
                  >
                    <Forward10Icon className="h-[22px] w-[22px]" />
                  </button>
                </>
              ) : null}

              {data.mode === 'ep' && data.next && !isTrailer ? (
                <button
                  type="button"
                  onClick={goToNextEpisode}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-soft hover:text-amber"
                >
                  <SkipForwardIcon className="h-4 w-4" />
                  <span className="hidden min-[520px]:inline">
                    {data.next.season === data.season ? 'Próximo ep.' : 'Próxima temporada'}
                  </span>
                </button>
              ) : null}

              {!isLive ? (
                <p className="text-[13px] tabular-nums text-white/85 sm:text-sm">
                  {formatClock((totalSeconds * progress) / 100)}{' '}
                  <span className="text-white/40">/ {formatClock(totalSeconds)}</span>
                </p>
              ) : null}

              <div className="ml-auto flex flex-wrap items-center gap-3 text-white/85">
                <VolumeSlider
                  volume={prefs.volume}
                  muted={prefs.muted}
                  onChange={setVolume}
                  onToggleMute={toggleMute}
                />

                {!isLive ? (
                  <button
                    type="button"
                    onClick={() => setPrefs({ subsOn: !prefs.subsOn })}
                    aria-pressed={prefs.subsOn}
                    aria-label="Legendas"
                    title="Legendas"
                    className={`grid h-8 w-9 place-items-center rounded-lg border ${
                      prefs.subsOn
                        ? 'border-amber/50 bg-amber/18 text-amber-soft'
                        : 'border-white/25 text-white/85'
                    }`}
                  >
                    <CaptionsIcon className="h-[18px] w-[18px]" />
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setShowSettings((s) => !s)}
                  aria-expanded={showSettings}
                  aria-label="Configurações de reprodução"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/25 px-2.5 text-[13px] font-semibold transition-colors hover:bg-white/10"
                >
                  <SettingsIcon className="h-4 w-4" />
                  {prefs.quality}
                </button>

                {!isLive ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPrefs({ size: prefs.size === 'compacto' ? 'cinema' : 'compacto' })
                    }
                    aria-label={prefs.size === 'compacto' ? 'Ampliar o palco' : 'Reduzir o palco'}
                    title={prefs.size === 'compacto' ? 'Ampliar' : 'Compacto'}
                    className="hidden h-8 w-9 place-items-center rounded-lg border border-white/25 transition-colors hover:bg-white/10 lg:grid"
                  >
                    {prefs.size === 'compacto' ? (
                      <ExpandIcon className="h-4 w-4" />
                    ) : (
                      <CollapseIcon className="h-4 w-4" />
                    )}
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Tela cheia"
                  title="Tela cheia"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber/50 bg-amber/16 px-2.5 text-[13px] font-bold text-amber-soft transition-colors hover:bg-amber/28 sm:px-3"
                >
                  <FullscreenIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Tela cheia</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/8 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/14"
          >
            <ArrowLeftIcon className="h-[18px] w-[18px]" />
            {backLabel}
          </Link>
          <p className="text-[13px] text-white/50">
            Legendas em <b className="text-amber-soft">{prefs.sub}</b> · Áudio{' '}
            <b className="text-amber-soft">{prefs.audio}</b> · Ajuste nas configurações. Atalhos:{' '}
            <b className="text-amber-soft">espaço</b>, setas, <b className="text-amber-soft">F</b>,{' '}
            <b className="text-amber-soft">M</b>.
          </p>
        </div>

        <div className="mt-6 max-w-[820px]">
          <h1 className="font-display text-2xl font-bold sm:text-[28px]">{title}</h1>
          <p className="mt-2 text-sm text-white/70">{subtitle}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-pretty text-white/72 sm:text-[16px]">
            {synopsis}
          </p>

          {!isLive ? (
            <Link
              href={`/title/${data.media.id}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-soft hover:text-amber"
            >
              <InfoIcon className="h-4 w-4" />
              Ver a ficha completa
            </Link>
          ) : null}
        </div>

        {!isLive ? <TitleDetails media={data.media} className="mt-10 max-w-[900px]" /> : null}

        {related.length > 0 ? (
          <RelatedRow
            items={related}
            title="Você também deve gostar"
            variant="compact"
            // O player já tem padding lateral; a fileira não repete o dela.
            flush
            className="mt-10"
          />
        ) : null}

        {data.mode === 'ep' && data.upNext.length > 0 ? (
          <section className="mt-9">
            <h2 className="mb-4 font-display text-xl font-bold">A seguir nesta temporada</h2>
            <ul className="row-scroll flex gap-4 pb-2.5">
              {data.upNext.map((ep) => (
                <li key={ep.n} className="snap-item w-[220px] shrink-0 sm:w-[260px]">
                  <Link
                    href={`/watch/ep/${data.media.id}/${data.season}/${ep.n}`}
                    className="block"
                  >
                    <span className="relative block aspect-video overflow-hidden rounded-xl border border-white/8 bg-surface-2 transition-colors hover:border-amber/50">
                      <PosterImage
                        src={ep.thumb}
                        alt=""
                        hue={data.media.hue}
                        sizes="(max-width: 639px) 220px, 260px"
                        position="center 25%"
                      />
                      <span className="absolute top-2 left-2 rounded-md bg-black/62 px-2 py-0.5 text-[11px] font-semibold">
                        {ep.dur}min
                      </span>
                    </span>
                    <span className="mt-2 block text-sm font-semibold">
                      E{ep.n} · {ep.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default PlayerScreen;
