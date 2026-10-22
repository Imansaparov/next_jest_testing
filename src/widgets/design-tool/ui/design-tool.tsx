import {
  DesignCanvas,
  DesignPalette,
  DragHint,
} from '@/features/tile-designer';

import { cn } from '@/shared/lib/cn';

type DesignToolProps = {
  className?: string;
};


export function DesignTool({ className }: DesignToolProps) {
  return (
    <section
      id="design-tool"
      aria-labelledby="design-tool-heading"
      className={cn(
        'relative hidden min-w-0 md:block md:self-start md:pt-[33px]',
        className
      )}
    >
      <div className="relative">
        <div className="grid grid-cols-[minmax(0,1fr)_25.6%] overflow-hidden rounded-[6px] border-2 border-ink bg-paper">
          <div className="flex min-w-0 flex-col">
            <header className="flex h-[75px] flex-col justify-start border-b-2 border-ink bg-paper-muted px-2 pt-[10px] text-center">
              <h2
                id="design-tool-heading"
                className="text-[1.05rem] leading-[1.15] font-bold tracking-wide uppercase"
              >
                Visualize your order:
              </h2>
              <p className="text-[0.82rem] leading-[1.2] font-semibold">
                Drag and drop tiles here to create patterns.
              </p>
            </header>
            <DesignCanvas />
          </div>

          <aside
            aria-labelledby="design-palette-heading"
            className="flex min-h-0 flex-col border-l-2 border-ink bg-paper-muted"
          >
            <h3
              id="design-palette-heading"
              className="flex h-[42px] shrink-0 items-center justify-center border-b-2 border-ink text-[0.8rem] leading-none font-bold tracking-wide whitespace-nowrap uppercase lg:text-[1.05rem]"
            >
              Design Palette
            </h3>
            <div className="relative min-h-0 flex-1">
              <DesignPalette className="absolute inset-0" />
            </div>
          </aside>
        </div>

        <DragHint className="top-[58.4%] left-[44.4%] w-[37.9%]" />
      </div>
    </section>
  );
}
