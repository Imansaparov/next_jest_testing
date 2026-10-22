import { GRID_COLUMNS, GRID_ROWS } from '../lib/grid';
import {
  cellActivated,
  cellCleared,
  designGridSlice,
  designSelected,
  eraserToggled,
  gridCleared,
  gridReset,
  initialGridCells,
  selectPlacedTileCount,
  tileMoved,
  tilePlaced,
} from './design-grid.slice';

const reducer = designGridSlice.reducer;
const initialState = reducer(undefined, { type: '@@init' });
const LAST_INDEX = GRID_COLUMNS * GRID_ROWS - 1;

describe('design grid slice', () => {
  it('is a 7 × 7 grid', () => {
    expect(initialState.columns).toBe(7);
    expect(initialState.rows).toBe(7);
    expect(initialState.cells).toHaveLength(49);
  });

  it('keeps the sample pattern in the first columns of each row', () => {
    expect(initialState.cells[0]).toBe('mustard-arc');
    expect(initialState.cells[GRID_COLUMNS]).toBe('indigo-quarter');
    expect(initialState.cells[GRID_COLUMNS - 1]).toBeNull();
  });

  it('places the selected palette tile into an empty cell', () => {
    const withTool = reducer(initialState, designSelected('indigo-dove'));
    const state = reducer(withTool, cellActivated(LAST_INDEX));

    expect(state.cells[LAST_INDEX]).toBe('indigo-dove');
  });

  it('replaces a different tile and toggles off the same tile', () => {
    const withTool = reducer(initialState, designSelected('yellow-star'));

    const replaced = reducer(withTool, cellActivated(0));
    expect(replaced.cells[0]).toBe('yellow-star');

    const toggled = reducer(replaced, cellActivated(0));
    expect(toggled.cells[0]).toBeNull();
  });

  it('clears cells with the eraser tool', () => {
    const erasing = reducer(initialState, eraserToggled());
    const state = reducer(erasing, cellActivated(1));

    expect(state.cells[1]).toBeNull();
    expect(state.selectedDesignId).toBe(initialState.selectedDesignId);
  });

  it('turns the eraser off when a palette tile is chosen', () => {
    const erasing = reducer(initialState, eraserToggled());
    const state = reducer(erasing, designSelected('mustard-arc'));

    expect(state.isErasing).toBe(false);
    expect(state.selectedDesignId).toBe('mustard-arc');
  });

  it('places a dropped tile regardless of the active tool', () => {
    const state = reducer(
      initialState,
      tilePlaced({ index: 10, designId: 'sage-chevron' })
    );

    expect(state.cells[10]).toBe('sage-chevron');
  });

  it('swaps tiles when moving between cells', () => {
    const state = reducer(initialState, tileMoved({ from: 0, to: LAST_INDEX }));

    expect(state.cells[LAST_INDEX]).toBe(initialGridCells[0]);
    expect(state.cells[0]).toBeNull();
  });

  it('ignores out-of-range indexes', () => {
    expect(reducer(initialState, cellActivated(49))).toEqual(initialState);
    expect(reducer(initialState, cellCleared(-1))).toEqual(initialState);
    expect(reducer(initialState, tileMoved({ from: 0, to: 100 }))).toEqual(
      initialState
    );
  });

  it('clears and resets the whole grid', () => {
    const cleared = reducer(initialState, gridCleared());
    expect(selectPlacedTileCount({ designGrid: cleared })).toBe(0);

    const reset = reducer(cleared, gridReset());
    expect(reset.cells).toEqual(initialGridCells);
  });
});
