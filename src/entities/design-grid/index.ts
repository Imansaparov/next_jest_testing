export { GRID_COLUMNS, GRID_ROWS, toPosition } from './lib/grid';
export {
  cellActivated,
  cellCleared,
  designGridSlice,
  designSelected,
  eraserToggled,
  gridCleared,
  gridReset,
  selectGridCells,
  selectGridColumns,
  selectGridRows,
  selectIsErasing,
  selectPlacedTileCount,
  selectSelectedDesignId,
  tileMoved,
  tilePlaced,
} from './model/design-grid.slice';
export type { DesignGridState, GridCell } from './model/design-grid.types';
