import {
  desktopBottomLeft,
  desktopBottomRight,
  desktopCornerLeft,
  desktopCornerRight,
  desktopLeftFillA,
  desktopLeftFillB,
  desktopLeftLower,
  desktopLeftMiddle,
  desktopLeftUpper,
  desktopPaletteHand,
  desktopRightFillA,
  desktopRightFillB,
  desktopRightLower,
  desktopRightMiddle,
  desktopRightUpper,
  desktopTopLeft,
  desktopTopRight,
  mobileBottomLeft,
  mobileBottomMiddle,
  mobileTopLeft,
  mobileTopRight,
} from '@/shared/assets/decor';
import { DecorImage } from '@/shared/ui/decor';

const sideStrip =
  'absolute hidden flex-col justify-between overflow-hidden lg:flex [&>*:not(:first-child,:last-child)]:min-h-0 [&>*:not(:first-child,:last-child)]:shrink [&>*:not(:first-child,:last-child)]:object-cover [&>*:not(:first-child,:last-child)]:object-top';

export function PageDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* ---------- tablet & desktop ---------- */}
      <DecorImage
        src={desktopTopLeft}
        priority
        className="absolute top-[37px] left-[3px] hidden min-[1300px]:block"
      />
      <DecorImage
        src={desktopTopRight}
        priority
        className="absolute top-[37px] right-[2px] hidden min-[1300px]:block"
      />
      <DecorImage
        src={desktopCornerLeft}
        className="absolute top-[55px] left-[3px] hidden md:block lg:top-[37px] min-[1300px]:hidden"
      />
      <DecorImage
        src={desktopCornerRight}
        className="absolute top-[55px] right-[2px] hidden md:block lg:top-[37px] min-[1300px]:hidden"
      />

      <div
        className={`${sideStrip} top-[158px] bottom-[142px] left-[3px] lg:top-[140px]`}
      >
        <DecorImage src={desktopLeftUpper} />
        <DecorImage src={desktopLeftFillB} />
        <DecorImage src={desktopLeftMiddle} />
        <DecorImage src={desktopLeftFillA} />
        <DecorImage src={desktopLeftLower} />
      </div>
      <div
        className={`${sideStrip} top-[164px] right-[2px] bottom-[74px] lg:top-[146px]`}
      >
        <DecorImage src={desktopRightUpper} />
        <DecorImage src={desktopRightFillB} />
        <DecorImage src={desktopRightMiddle} />
        <DecorImage src={desktopRightFillA} />
        <DecorImage src={desktopRightLower} />
      </div>

      <DecorImage
        src={desktopBottomLeft}
        className="absolute bottom-[2px] left-[3px] hidden h-auto w-[min(491px,34%)] md:block min-[1424px]:w-[491px]"
      />
      <DecorImage
        src={desktopPaletteHand}
        className="absolute right-[363px] bottom-[2px] hidden min-[1424px]:block"
      />
      <DecorImage
        src={desktopBottomRight}
        className="absolute right-[2px] bottom-[2px] hidden h-auto w-[min(361px,30%)] md:block min-[1424px]:w-[361px]"
      />

      {/* ---------- mobile (mockup drawn @2×, sizes relative to width) ---------- */}
      <DecorImage
        src={mobileTopLeft}
        priority
        className="absolute top-13 left-0 h-auto w-[8.5%] md:hidden"
      />
      <DecorImage
        src={mobileTopRight}
        priority
        className="absolute top-13 right-0 h-auto w-[7.9%] md:hidden"
      />
      <DecorImage
        src={mobileBottomLeft}
        className="absolute bottom-0 left-0 h-auto w-[40%] md:hidden"
      />
      <DecorImage
        src={mobileBottomMiddle}
        className="absolute bottom-0 left-[39%] h-auto w-[38%] md:hidden"
      />
    </div>
  );
}
