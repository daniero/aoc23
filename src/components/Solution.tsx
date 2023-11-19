import { lazy, type ReactElement, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function Solution({ day }: { day: number }): ReactElement {
  const folder = String(day).padStart(2, '0');
  const Module = lazy(
    async () => await import(`../solutions/${folder}/Index.tsx`)
  );

  return (
    <>
      <ErrorBoundary fallback={<div>Oh noes</div>}>
        <Suspense fallback={<div />}>
          <Module />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
