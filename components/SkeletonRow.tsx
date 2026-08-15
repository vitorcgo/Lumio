/** Placeholder de fileira usado enquanto uma rota carrega. */
export function SkeletonRow({ cards = 6 }: { cards?: number }) {
  return (
    <div className="mt-9">
      <div className="skeleton mb-[18px] ml-4 h-[22px] w-[220px] rounded-md sm:ml-6 lg:ml-10" />
      <div className="flex gap-3 overflow-hidden px-4 sm:gap-4 sm:px-6 lg:px-10">
        {Array.from({ length: cards }, (_, i) => (
          <div
            key={i}
            className="skeleton aspect-2/3 w-[132px] shrink-0 rounded-[14px] sm:w-[160px] lg:w-[196px]"
          />
        ))}
      </div>
    </div>
  );
}

/** Placeholder de grade usado nas telas de navegação e busca. */
export function SkeletonGrid({ cards = 12 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:gap-5 lg:grid-cols-[repeat(auto-fill,minmax(184px,1fr))]">
      {Array.from({ length: cards }, (_, i) => (
        <div key={i} className="skeleton aspect-2/3 rounded-[14px]" />
      ))}
    </div>
  );
}
