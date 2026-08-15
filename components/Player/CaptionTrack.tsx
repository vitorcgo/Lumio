/** Faixa de legenda sobreposta ao vídeo. O texto varia por título. */
export function CaptionTrack({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center px-6 sm:bottom-[120px] sm:px-10">
      <p className="max-w-[76%] rounded-lg bg-black/72 px-4 py-2 text-center text-base font-medium sm:text-[22px]">
        {text}
      </p>
    </div>
  );
}
