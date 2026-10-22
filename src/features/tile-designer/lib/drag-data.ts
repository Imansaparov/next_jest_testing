import { type TileDesignId, isTileDesignId } from '@/entities/tile';

const DESIGN_MIME = 'application/x-artisan-design';
const CELL_MIME = 'application/x-artisan-cell';

export type DragPayload =
  | { source: 'palette'; designId: TileDesignId }
  | { source: 'cell'; index: number };

export function writeDragPayload(
  dataTransfer: DataTransfer,
  payload: DragPayload
) {
  if (payload.source === 'palette') {
    dataTransfer.setData(DESIGN_MIME, payload.designId);
    dataTransfer.effectAllowed = 'copy';
  } else {
    dataTransfer.setData(CELL_MIME, String(payload.index));
    dataTransfer.effectAllowed = 'move';
  }
}

export function hasDragPayload(dataTransfer: DataTransfer): boolean {
  return (
    dataTransfer.types.includes(DESIGN_MIME) ||
    dataTransfer.types.includes(CELL_MIME)
  );
}

export function readDragPayload(
  dataTransfer: DataTransfer
): DragPayload | null {
  const designId = dataTransfer.getData(DESIGN_MIME);
  if (isTileDesignId(designId)) return { source: 'palette', designId };

  const cell = dataTransfer.getData(CELL_MIME);
  if (cell !== '' && Number.isInteger(Number(cell))) {
    return { source: 'cell', index: Number(cell) };
  }

  return null;
}
