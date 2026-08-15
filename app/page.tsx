import { BrandStrip } from '@/components/BrandStrip';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HomeRows } from '@/components/HomeRows';
import { Splash } from '@/components/Splash';
import { Top10Row } from '@/components/Top10Row';
import { getHeroItems, pickMedia } from '@/lib/catalog';
import { HERO_IDS, TOP10_IDS } from '@/lib/data';

export default function HomePage() {
  const top10 = pickMedia(TOP10_IDS);
  const highlights = getHeroItems(HERO_IDS);

  return (
    <>
      <Splash />
      <Hero items={highlights} />

      <div className="relative z-2 -mt-2 pb-10 sm:-mt-14">
        {/* Decorativa: no celular só empurrava o Top 10 para fora da dobra. */}
        <div className="hidden sm:block">
          <BrandStrip />
        </div>
        <Top10Row items={top10} />
        <HomeRows />
      </div>

      <Footer />
    </>
  );
}
