export const TILE_DESIGN_IDS = [
  'ocean-wave',
  'forest-fern',
  'terracotta-dot',
  'yellow-star',
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
  'mustard-arc',
  'indigo-arc',
  'indigo-quarter',
  'amber-compass',
  'terracotta-compass',
  'fern-star',
  'saffron-flake',
  'terracotta-dot-b',
  'terracotta-dot-c',
] as const;

export type TileDesignId = (typeof TILE_DESIGN_IDS)[number];

export type TileDesign = {
  id: TileDesignId;
  name: string;
  unitPrice: number;
};
