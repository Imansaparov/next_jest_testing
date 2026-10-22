'use client';

import { AnimatePresence, motion } from 'motion/react';

import { CartTotals, selectCartItems, selectCartTotals } from '@/entities/cart';
import { TileArt } from '@/entities/tile';

import {
  AddTileMenu,
  CartItemActions,
  QuantityInput,
} from '@/features/manage-cart';

import { desktopCartHand, mobileCartHand } from '@/shared/assets/decor';
import { cn } from '@/shared/lib/cn';
import { formatCurrency } from '@/shared/lib/format';
import { useAppSelector } from '@/shared/lib/redux';
import { Bracketed } from '@/shared/ui/bracketed';
import { DecorImage } from '@/shared/ui/decor';

import { useVisibleRows } from '../lib/use-visible-rows';

const cellClass =
  'border-2 border-ink px-1 py-[3px] text-center align-middle md:px-1.5 md:py-1.5 lg:px-1';
const headCellClass = cn(
  cellClass,
  // sticky header: the inset shadow redraws the bottom border while scrolling
  'sticky top-0 z-10 bg-paper-muted shadow-[inset_0_-2px_0_theme(colors.ink.DEFAULT)] py-[2px] text-[0.66rem] leading-[1.05] font-semibold tracking-wide uppercase md:py-2 md:text-[0.76rem] lg:h-[40px] lg:py-0 lg:text-[0.78rem]'
);

type ShoppingCartProps = {
  className?: string;
};

export function ShoppingCart({ className }: ShoppingCartProps) {
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  // The mockup shows 4 rows; from the 6th item on the table scrolls.
  const { scrollerRef, maxHeight } = useVisibleRows(5, items.length);

  return (
    <section
      id="cart"
      aria-labelledby="cart-heading"
      className={cn('min-w-0 scroll-mt-4', className)}
    >
      <h2
        id="cart-heading"
        className="sr-only text-[1.65rem] leading-9 font-bold tracking-wide uppercase md:not-sr-only md:mb-1 md:text-[1.4rem] lg:mb-[5px] lg:text-[1.6rem] lg:leading-[28px]"
      >
        Shopping Cart{' '}
        <span className="hidden md:inline">&amp; Design Tool</span>
      </h2>

      <div
        ref={scrollerRef}
        style={{ maxHeight }}
        className={cn(
          'border-2 border-ink',
          maxHeight
            ? 'overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-color:theme(colors.navy.DEFAULT)_transparent] [scrollbar-width:thin]'
            : 'overflow-hidden'
        )}
      >
        <table className="-m-[2px] w-[calc(100%+4px)] table-fixed border-collapse">
          <colgroup>
            {/* column proportions measured on both mockups */}
            <col className="w-[27.4%]" />
            <col className="w-[20%]" />
            <col className="w-[17.6%]" />
            <col className="w-[18.4%]" />
            <col className="w-[16.6%]" />
          </colgroup>
          <thead className="bg-paper-muted">
            <tr>
              <th scope="col" className={headCellClass}>
                Tile Collection
              </th>
              <th scope="col" className={headCellClass}>
                Item
              </th>
              <th scope="col" className={headCellClass}>
                Quantity
                <span className="block text-[0.85em] normal-case">
                  (sq. ft.)
                </span>
              </th>
              <th scope="col" className={headCellClass}>
                Unit Price
                <span className="block text-[0.85em]">($)</span>
              </th>
              <th scope="col" className={headCellClass}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {items.map(item => (
                <motion.tr
                  key={item.designId}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                >
                  <th scope="row" className={cn(cellClass, 'font-normal')}>
                    <span className="flex flex-col items-center gap-1">
                      <TileArt
                        designId={item.designId}
                        variant="emblem"
                        className="size-[34px] border-2 border-ink md:size-9 lg:size-[44px]"
                      />
                      <span className="text-[0.62rem] leading-none font-semibold tracking-wide uppercase md:text-[0.66rem] lg:text-[0.72rem]">
                        {item.name}
                      </span>
                    </span>
                  </th>
                  <td className={cn(cellClass, 'p-1.5')}>
                    <TileArt
                      designId={item.designId}
                      className="mx-auto aspect-square w-full max-w-[49px] md:max-w-14 lg:max-w-[57px]"
                    />
                  </td>
                  <td className={cellClass}>
                    <QuantityInput
                      designId={item.designId}
                      quantity={item.quantity}
                      label={`${item.name} quantity in square feet`}
                    />
                  </td>
                  <td className={cn(cellClass, 'whitespace-nowrap')}>
                    <Bracketed className="text-[0.78rem] font-semibold tabular-nums md:text-[0.8rem] lg:text-[0.95rem]">
                      {formatCurrency(item.unitPrice)}
                    </Bracketed>
                  </td>
                  <td className={cn(cellClass, 'px-0.5')}>
                    <CartItemActions
                      designId={item.designId}
                      name={item.name}
                    />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className={cn(cellClass, 'py-8')}>
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-semibold uppercase"
                  >
                    Your cart is empty
                  </motion.p>
                  <p className="text-ink-soft">
                    Add a tile collection to start your order.
                  </p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* "Add new tile" on the left, totals on the right — always one row.
          The hand illustration appears only when the row has room for it. */}
      <div className="@container">
        {/* on tablet it wraps instead of overflowing into the next column */}
        <div className="flex items-start justify-between gap-x-1 gap-y-1 md:flex-wrap md:gap-x-2 lg:flex-nowrap">
          <div className="flex shrink-0 items-start pt-[5px] md:items-center md:pt-2.5">
            <DecorImage
              src={mobileCartHand}
              scale={0.5}
              className="-my-1 -mr-1 hidden h-auto w-[60px] shrink-0 max-md:@[19rem]:block"
            />
            <DecorImage
              src={desktopCartHand}
              className="-my-2 -mr-1 hidden h-auto w-[66px] shrink-0 md:@[27rem]:block lg:@[23rem]:block"
            />
            <AddTileMenu />
          </div>
          <CartTotals
            totals={totals}
            className="mt-[6px] ml-auto shrink-0 md:-mt-0.5"
          />
        </div>
      </div>
    </section>
  );
}
