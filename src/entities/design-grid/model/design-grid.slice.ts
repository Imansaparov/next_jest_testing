import {
  type PayloadAction,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import type { TileDesignId } from '@/entities/tile';

import {
  GRID_COLUMNS,
  GRID_ROWS,
  createEmptyGrid,
  createGridFromRows,
  isCellIndex,
} from '../lib/grid';
import type { DesignGridState } from './design-grid.types';

export const initialGridCells = createGridFromRows([
  ['mustard-arc', 'indigo-arc', 'amber-compass', 'terracotta-compass'],
  ['indigo-quarter', 'terracotta-dot', 'saffron-flake', 'indigo-quarter'],
  ['terracotta-dot-b', 'forest-fern', 'fern-star', 'forest-fern'],
  ['terracotta-dot-b', 'terracotta-dot-c', 'forest-fern', 'ocean-wave'],
  ['terracotta-compass', 'terracotta-dot', 'ocean-wave', 'yellow-star'],
  ['ocean-wave', 'yellow-star', 'forest-fern'],
]);

const initialState: DesignGridState = {
  columns: GRID_COLUMNS,
  rows: GRID_ROWS,
  cells: initialGridCells,
  selectedDesignId: 'ocean-wave',
  isErasing: false,
};

export const designGridSlice = createSlice({
  name: 'designGrid',
  initialState,
  reducers: {
    designSelected(state, action: PayloadAction<TileDesignId>) {
      state.selectedDesignId = action.payload;
      state.isErasing = false;
    },
    eraserToggled(state) {
      state.isErasing = !state.isErasing;
    },
    cellActivated(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (!isCellIndex(index, state)) return;

      if (state.isErasing) {
        state.cells[index] = null;
        return;
      }

      const designId = state.selectedDesignId;
      state.cells[index] = state.cells[index] === designId ? null : designId;
    },
    tilePlaced(
      state,
      action: PayloadAction<{ index: number; designId: TileDesignId }>
    ) {
      const { index, designId } = action.payload;
      if (isCellIndex(index, state)) state.cells[index] = designId;
    },
    tileMoved(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (from === to || !isCellIndex(from, state) || !isCellIndex(to, state)) {
        return;
      }

      const moving = state.cells[from] ?? null;
      state.cells[from] = state.cells[to] ?? null;
      state.cells[to] = moving;
    },
    cellCleared(state, action: PayloadAction<number>) {
      if (isCellIndex(action.payload, state)) {
        state.cells[action.payload] = null;
      }
    },
    gridCleared(state) {
      state.cells = createEmptyGrid(state);
    },
    gridReset(state) {
      state.cells = initialGridCells;
    },
  },
  selectors: {
    selectGridCells: state => state.cells,
    selectGridColumns: state => state.columns,
    selectGridRows: state => state.rows,
    selectSelectedDesignId: state => state.selectedDesignId,
    selectIsErasing: state => state.isErasing,
  },
});

export const {
  designSelected,
  eraserToggled,
  cellActivated,
  tilePlaced,
  tileMoved,
  cellCleared,
  gridCleared,
  gridReset,
} = designGridSlice.actions;

export const {
  selectGridCells,
  selectGridColumns,
  selectGridRows,
  selectSelectedDesignId,
  selectIsErasing,
} = designGridSlice.selectors;

export const selectPlacedTileCount = createSelector(
  [selectGridCells],
  cells => cells.filter(Boolean).length
);
