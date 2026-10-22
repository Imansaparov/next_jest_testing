import Image, { type StaticImageData } from 'next/image';

import { cn } from '@/shared/lib/cn';

import {
  TILE_EMBLEMS,
  TILE_EMBLEMS_DESKTOP,
  TILE_GRID_ART,
  TILE_PATTERNS,
  TILE_PATTERNS_DESKTOP,
} from '../../assets';
import type { TileDesignId } from '../../model/tile.types';

type TileArtVariant = 'pattern' | 'emblem' | 'grid';

type TileArtProps = {
  designId: TileDesignId;
  variant?: TileArtVariant;
  className?: string;
  title?: string;
};

function resolveArt(
  designId: TileDesignId,
  variant: TileArtVariant
): { base: StaticImageData; desktop?: StaticImageData | undefined } {
  const pattern = TILE_PATTERNS[designId];

  switch (variant) {
    case 'grid':
      return { base: TILE_GRID_ART[designId] ?? pattern };
    case 'emblem':
      return {
        base: TILE_EMBLEMS[designId] ?? pattern,
        desktop: TILE_EMBLEMS_DESKTOP[designId],
      };
    default:
      return { base: pattern, desktop: TILE_PATTERNS_DESKTOP[designId] };
  }
}

export function TileArt({
  designId,
  variant = 'pattern',
  className,
  title,
}: TileArtProps) {
  const { base, desktop } = resolveArt(designId, variant);
  const alt = title ?? '';
  const imageProps = {
    'aria-hidden': title ? undefined : true,
    draggable: false,
  } as const;
  const imageClass = cn('block object-cover select-none', className);

  if (!desktop) {
    return (
      <Image src={base} alt={alt} {...imageProps} className={imageClass} />
    );
  }

  return (
    <>
      <Image
        src={base}
        alt={alt}
        {...imageProps}
        className={cn(imageClass, 'lg:hidden')}
      />
      <Image
        src={desktop}
        alt={alt}
        {...imageProps}
        className={cn(imageClass, 'hidden lg:block')}
      />
    </>
  );
}
