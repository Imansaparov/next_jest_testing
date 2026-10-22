'use client';

import { AnimatePresence, motion } from 'motion/react';

type FieldErrorProps = {
  id: string;
  message?: string | undefined;
};

export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key="error"
          id={id}
          className="text-sm leading-5 font-medium text-terracotta-dark"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
