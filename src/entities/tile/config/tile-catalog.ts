import {
  TILE_DESIGN_IDS,
  type TileDesign,
  type TileDesignId,
} from '../model/tile.types';

export const TILE_CATALOG: Readonly<Record<TileDesignId, TileDesign>> = {
  'ocean-wave': { id: 'ocean-wave', name: 'Ocean Wave', unitPrice: 2800 },
  'forest-fern': { id: 'forest-fern', name: 'Forest Fern', unitPrice: 3000 },
  'terracotta-dot': {
    id: 'terracotta-dot',
    name: 'Terracotta Dot',
    unitPrice: 2600,
  },
  'yellow-star': { id: 'yellow-star', name: 'Yellow Star', unitPrice: 2900 },
  'terracotta-floral': {
    id: 'terracotta-floral',
    name: 'Terracotta Floral',
    unitPrice: 2700,
  },
  'navy-compass': {
    id: 'navy-compass',
    name: 'Navy Compass',
    unitPrice: 3200,
  },
  'fern-medallion': {
    id: 'fern-medallion',
    name: 'Fern Medallion',
    unitPrice: 3100,
  },
  'saffron-bloom': {
    id: 'saffron-bloom',
    name: 'Saffron Bloom',
    unitPrice: 2750,
  },
  'indigo-cross': {
    id: 'indigo-cross',
    name: 'Indigo Cross',
    unitPrice: 3150,
  },
  'golden-herringbone': {
    id: 'golden-herringbone',
    name: 'Golden Herringbone',
    unitPrice: 2450,
  },
  'sage-chevron': {
    id: 'sage-chevron',
    name: 'Sage Chevron',
    unitPrice: 2500,
  },
  'azure-swallow': {
    id: 'azure-swallow',
    name: 'Azure Swallow',
    unitPrice: 3400,
  },
  'terracotta-arch': {
    id: 'terracotta-arch',
    name: 'Terracotta Arch',
    unitPrice: 2650,
  },
  'indigo-dove': { id: 'indigo-dove', name: 'Indigo Dove', unitPrice: 3400 },
  'mustard-arc': { id: 'mustard-arc', name: 'Mustard Arc', unitPrice: 2550 },
  'indigo-arc': { id: 'indigo-arc', name: 'Indigo Arc', unitPrice: 2550 },
  'indigo-quarter': {
    id: 'indigo-quarter',
    name: 'Indigo Quarter',
    unitPrice: 2550,
  },
  'amber-compass': {
    id: 'amber-compass',
    name: 'Amber Compass',
    unitPrice: 3050,
  },
  'terracotta-compass': {
    id: 'terracotta-compass',
    name: 'Terracotta Compass',
    unitPrice: 3050,
  },
  'fern-star': { id: 'fern-star', name: 'Fern Star', unitPrice: 2900 },
  'saffron-flake': {
    id: 'saffron-flake',
    name: 'Saffron Flake',
    unitPrice: 2950,
  },
  'terracotta-dot-b': {
    id: 'terracotta-dot-b',
    name: 'Terracotta Dot',
    unitPrice: 2600,
  },
  'terracotta-dot-c': {
    id: 'terracotta-dot-c',
    name: 'Terracotta Dot',
    unitPrice: 2600,
  },
};

export const PALETTE_DESIGN_IDS: readonly TileDesignId[] = [
  'terracotta-floral',
  'navy-compass',
  'fern-medallion',
  'saffron-bloom',
  'indigo-cross',
  'golden-herringbone',
  'sage-chevron',
  'azure-swallow',
  'terracotta-arch',
  'indigo-dove',
];

export function getTileDesign(id: TileDesignId): TileDesign {
  return TILE_CATALOG[id];
}

export function isTileDesignId(value: unknown): value is TileDesignId {
  return (
    typeof value === 'string' &&
    (TILE_DESIGN_IDS as readonly string[]).includes(value)
  );
}
