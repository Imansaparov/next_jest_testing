'use client';

import { cn } from '@/shared/lib/cn';
import { RuledTextarea, TextField } from '@/shared/ui/field';

import { useCheckoutField } from '../../model/use-checkout-field';

type ProjectNotesFieldsProps = {
  className?: string;
};

export function ProjectNotesFields({ className }: ProjectNotesFieldsProps) {
  const projectName = useCheckoutField('projectName');
  const notes = useCheckoutField('notes');

  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      <TextField
        {...projectName.inputProps}
        label={
          <>
            <span className="lg:hidden">Project Name / Notes:</span>
            <span className="hidden lg:inline">Project Notes:</span>
          </>
        }
      />
      <RuledTextarea
        {...notes.inputProps}
        rows={1}
        className="h-[19px] overflow-hidden border-b-[1.5px] border-ink bg-none text-[0.86rem] leading-[18px] md:h-auto md:border-b-0 md:bg-ruled md:text-base md:leading-8 lg:h-[40px] lg:text-[0.8rem]"
        aria-label="Additional notes"
        maxLength={500}
      />
    </div>
  );
}
