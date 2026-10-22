import type { StaticImageData } from 'next/image';

import type { TileDesignId } from '../model/tile.types';
import amberCompass from './amber-compass.png';
import azureSwallow from './azure-swallow.png';
import fernMedallion from './fern-medallion.png';
import fernStar from './fern-star.png';
import forestFernDesktop from './forest-fern-desktop.png';
import forestFernEmblemDesktop from './forest-fern-emblem-desktop.png';
import forestFernEmblem from './forest-fern-emblem.png';
import forestFernGrid from './forest-fern-grid.png';
import forestFern from './forest-fern.png';
import goldenHerringbone from './golden-herringbone.png';
import indigoArc from './indigo-arc.png';
import indigoCross from './indigo-cross.png';
import indigoDove from './indigo-dove.png';
import indigoQuarter from './indigo-quarter.png';
import mustardArc from './mustard-arc.png';
import navyCompass from './navy-compass.png';
import oceanWaveDesktop from './ocean-wave-desktop.png';
import oceanWaveEmblemDesktop from './ocean-wave-emblem-desktop.png';
import oceanWaveEmblem from './ocean-wave-emblem.png';
import oceanWaveGrid from './ocean-wave-grid.png';
import oceanWave from './ocean-wave.png';
import saffronBloom from './saffron-bloom.png';
import saffronFlake from './saffron-flake.png';
import sageChevron from './sage-chevron.png';
import terracottaArch from './terracotta-arch.png';
import terracottaCompass from './terracotta-compass.png';
import terracottaDotB from './terracotta-dot-b.png';
import terracottaDotC from './terracotta-dot-c.png';
import terracottaDotDesktop from './terracotta-dot-desktop.png';
import terracottaDotEmblemDesktop from './terracotta-dot-emblem-desktop.png';
import terracottaDotEmblem from './terracotta-dot-emblem.png';
import terracottaDotGrid from './terracotta-dot-grid.png';
import terracottaDot from './terracotta-dot.png';
import terracottaFloral from './terracotta-floral.png';
import yellowStarDesktop from './yellow-star-desktop.png';
import yellowStarEmblemDesktop from './yellow-star-emblem-desktop.png';
import yellowStarEmblem from './yellow-star-emblem.png';
import yellowStarGrid from './yellow-star-grid.png';
import yellowStar from './yellow-star.png';

/*
 * Tile artwork cut from the mockups by scripts/extract-tiles.py — the
 * hand-painted glazes can't be redrawn faithfully in code.
 *  - patterns:  default swatch (palette, cart on mobile — mobile mockup @2×);
 *  - desktop:   cart swatches as painted on the desktop mockup;
 *  - grid:      how a tile looks on the design grid, when it differs.
 */
export const TILE_PATTERNS: Record<TileDesignId, StaticImageData> = {
  'ocean-wave': oceanWave,
  'forest-fern': forestFern,
  'terracotta-dot': terracottaDot,
  'yellow-star': yellowStar,
  'terracotta-floral': terracottaFloral,
  'navy-compass': navyCompass,
  'fern-medallion': fernMedallion,
  'saffron-bloom': saffronBloom,
  'indigo-cross': indigoCross,
  'golden-herringbone': goldenHerringbone,
  'sage-chevron': sageChevron,
  'azure-swallow': azureSwallow,
  'terracotta-arch': terracottaArch,
  'indigo-dove': indigoDove,
  'mustard-arc': mustardArc,
  'indigo-arc': indigoArc,
  'indigo-quarter': indigoQuarter,
  'amber-compass': amberCompass,
  'terracotta-compass': terracottaCompass,
  'fern-star': fernStar,
  'saffron-flake': saffronFlake,
  'terracotta-dot-b': terracottaDotB,
  'terracotta-dot-c': terracottaDotC,
};

export const TILE_PATTERNS_DESKTOP: Partial<
  Record<TileDesignId, StaticImageData>
> = {
  'ocean-wave': oceanWaveDesktop,
  'forest-fern': forestFernDesktop,
  'terracotta-dot': terracottaDotDesktop,
  'yellow-star': yellowStarDesktop,
};

/** Collection emblems shown in the cart's first column. */
export const TILE_EMBLEMS: Partial<Record<TileDesignId, StaticImageData>> = {
  'ocean-wave': oceanWaveEmblem,
  'forest-fern': forestFernEmblem,
  'terracotta-dot': terracottaDotEmblem,
  'yellow-star': yellowStarEmblem,
};

export const TILE_EMBLEMS_DESKTOP: Partial<
  Record<TileDesignId, StaticImageData>
> = {
  'ocean-wave': oceanWaveEmblemDesktop,
  'forest-fern': forestFernEmblemDesktop,
  'terracotta-dot': terracottaDotEmblemDesktop,
  'yellow-star': yellowStarEmblemDesktop,
};

export const TILE_GRID_ART: Partial<Record<TileDesignId, StaticImageData>> = {
  'ocean-wave': oceanWaveGrid,
  'forest-fern': forestFernGrid,
  'terracotta-dot': terracottaDotGrid,
  'yellow-star': yellowStarGrid,
};
