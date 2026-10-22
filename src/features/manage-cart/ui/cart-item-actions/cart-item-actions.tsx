'use client';

import { motion } from 'motion/react';

import { BOX_SIZE_SQ_FT, itemAdded, itemRemoved } from '@/entities/cart';
import type { TileDesignId } from '@/entities/tile';

import { actionAdd, actionRemove } from '@/shared/assets/decor';
import { useAppDispatch } from '@/shared/lib/redux';
import { DecorImage } from '@/shared/ui/decor';
import { Tooltip } from '@/shared/ui/tooltip';

type CartItemActionsProps = {
  designId: TileDesignId;
  name: string;
};

const actionButtonClass =
  'group flex cursor-pointer flex-col items-center gap-[3px] rounded-md text-[0.5rem] leading-none font-semibold tracking-wide uppercase focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-navy';


export function CartItemActions({ designId, name }: CartItemActionsProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-end justify-center gap-[3px]">
      <Tooltip content={`Add 1 box (+${BOX_SIZE_SQ_FT} sq. ft.)`}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          className={actionButtonClass}
          aria-label={`Add 1 box of ${name}`}
          onClick={() =>
            dispatch(itemAdded({ designId, quantity: BOX_SIZE_SQ_FT }))
          }
        >
          <DecorImage
            src={actionAdd}
            className="h-[18px] w-auto transition-transform group-hover:scale-105 md:h-[22px] lg:h-[21px]"
          />
          <span aria-hidden="true">Add</span>
        </motion.button>
      </Tooltip>

      <Tooltip content={`Remove ${name} from the cart`}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.88 }}
          className={actionButtonClass}
          aria-label={`Remove ${name} from cart`}
          onClick={() => dispatch(itemRemoved(designId))}
        >
          <DecorImage
            src={actionRemove}
            className="h-[18px] w-auto transition-transform group-hover:scale-105 md:h-[22px] lg:h-[21px]"
          />
          <span aria-hidden="true">Remove</span>
        </motion.button>
      </Tooltip>
    </div>
  );
}
