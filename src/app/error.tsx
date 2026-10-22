'use client';

import { Button } from '@/shared/ui/button';

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  return (
    <div
      className="mx-auto my-16 flex w-[min(36rem,calc(100%-2rem))] flex-col items-center gap-4 rounded-frame border-2 border-ink bg-paper p-8 text-center"
      role="alert"
    >
      <p className="font-display text-2xl uppercase">Something cracked</p>
      <p className="text-lg font-medium">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Button onClick={retry}>Try again</Button>
    </div>
  );
}
