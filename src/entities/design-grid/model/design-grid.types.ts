import type { TileDesignId } from '@/entities/tile';

export type GridCell = TileDesignId | null;

export type DesignGridState = {
  columns: number;
  rows: number;
  cells: GridCell[];
  selectedDesignId: TileDesignId;
  isErasing: boolean;
};
