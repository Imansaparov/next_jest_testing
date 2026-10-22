import type { GridCell } from '../model/design-grid.types';

export const GRID_COLUMNS = 7;
export const GRID_ROWS = 7;

export type GridDimensions = { columns: number; rows: number };

const DEFAULT_DIMENSIONS: GridDimensions = {
  columns: GRID_COLUMNS,
  rows: GRID_ROWS,
};

export function createEmptyGrid({
  columns,
  rows,
}: GridDimensions = DEFAULT_DIMENSIONS): GridCell[] {
  return Array.from({ length: columns * rows }, () => null);
}

export function createGridFromRows(
  source: readonly (readonly GridCell[])[],
  dimensions: GridDimensions = DEFAULT_DIMENSIONS
): GridCell[] {
  return createEmptyGrid(dimensions).map((_, index) => {
    const { row, column } = toPosition(index, dimensions.columns);
    return source[row]?.[column] ?? null;
  });
}

export function toPosition(index: number, columns: number = GRID_COLUMNS) {
  return { row: Math.floor(index / columns), column: index % columns };
}

export function isCellIndex(
  index: number,
  { columns, rows }: GridDimensions = DEFAULT_DIMENSIONS
): boolean {
  return Number.isInteger(index) && index >= 0 && index < columns * rows;
}
