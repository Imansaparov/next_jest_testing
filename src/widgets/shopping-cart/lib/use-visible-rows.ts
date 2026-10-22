'use client';

import { useLayoutEffect, useRef, useState } from 'react';

export function useVisibleRows(rows: number, rowCount: number) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>();
  const previousCount = useRef(rowCount);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const table = scroller?.querySelector('table');
    if (!scroller || !table) return;

    const measure = () => {
      const head = table.tHead?.getBoundingClientRect().height ?? 0;
      const body = Array.from(table.tBodies[0]?.rows ?? []).slice(0, rows);
      const bodyHeight = body.reduce(
        (sum, row) => sum + row.getBoundingClientRect().height,
        0
      );
      setMaxHeight(
        rowCount > rows ? Math.ceil(head + bodyHeight) + 2 : undefined
      );
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(table);
    return () => observer.disconnect();
  }, [rows, rowCount]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller?.scrollTo && rowCount > previousCount.current) {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
    }
    previousCount.current = rowCount;
  }, [rowCount]);

  return { scrollerRef, maxHeight };
}
