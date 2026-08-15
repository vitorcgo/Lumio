import { BRANDS } from '@/lib/data';

/** Faixa de estúdios/marcas logo abaixo do hero. Puramente decorativa. */
export function BrandStrip() {
  return (
    <div className="row-scroll flex gap-3.5 px-4 sm:px-6 lg:px-10" aria-hidden="true">
      {BRANDS.map((brand) => (
        <div
          key={brand.label}
          className="grid h-[76px] w-[140px] shrink-0 place-items-center rounded-[14px] border border-white/7 bg-gradient-to-br from-surface-3 to-[#0d0d13] transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-amber/50 sm:h-[92px] sm:w-[172px]"
        >
          <span className={`font-display text-white ${brand.className}`}>{brand.label}</span>
        </div>
      ))}
    </div>
  );
}
