import {
  heroKiln,
  heroMuseum,
  heroTilesLeft,
  heroTilesLeftDesktop,
  heroTilesRight,
  heroTilesRightDesktop,
} from '@/shared/assets/decor';
import { DecorImage } from '@/shared/ui/decor';

const tileStripClass = 'h-[5.6cqw] w-auto shrink-0 md:hidden';
const tileStripDesktopClass =
  'hidden h-[26px] w-auto shrink-0 md:block lg:h-[32px]';
const sideIconClass = 'hidden h-[58px] w-auto shrink-0 md:block lg:h-[73px]';

export function OrderHero() {
  return (
    <div className="flex items-center justify-center gap-7 px-4 pt-[7px] text-center md:px-8 md:pt-[18px]">
      <DecorImage src={heroMuseum} priority className={sideIconClass} />

      <div>
        <h1 className="font-display text-[clamp(1.5rem,7.6cqw,3.4rem)] leading-[0.95] font-bold tracking-[0.005em] whitespace-nowrap uppercase font-stretch-[62%] md:text-[2.6rem] lg:text-[3.3rem]">
          Ceramic Tile Order Form
        </h1>
        <div className="mt-[5px] flex items-center justify-center gap-[2.2cqw] md:mt-[6px] md:gap-5">
          <DecorImage src={heroTilesLeft} priority className={tileStripClass} />
          <DecorImage
            src={heroTilesLeftDesktop}
            priority
            className={tileStripDesktopClass}
          />
          <p className="font-display text-[clamp(0.95rem,4.7cqw,2.2rem)] leading-none font-semibold tracking-[0.02em] whitespace-nowrap uppercase font-stretch-[68%] md:text-[1.3rem] lg:text-[1.6rem]">
            The Artisan Kiln
          </p>
          <DecorImage
            src={heroTilesRight}
            priority
            className={tileStripClass}
          />
          <DecorImage
            src={heroTilesRightDesktop}
            priority
            className={tileStripDesktopClass}
          />
        </div>
      </div>

      <DecorImage src={heroKiln} priority className={sideIconClass} />
    </div>
  );
}
