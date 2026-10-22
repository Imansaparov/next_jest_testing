import Image, { type StaticImageData } from 'next/image';

import { cn } from '@/shared/lib/cn';

type DecorImageProps = {
  src: StaticImageData;
  scale?: number;
  className?: string;
  priority?: boolean;
};

export function DecorImage({
  src,
  scale = 1,
  className,
  priority = false,
}: DecorImageProps) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      priority={priority}
      width={Math.round(src.width * scale)}
      height={Math.round(src.height * scale)}
      className={cn('pointer-events-none select-none', className)}
    />
  );
}
