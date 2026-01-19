import { Suspense } from 'react';
import ErrorPageClient from './ErrorPageClient';
import { FullScreenLoader } from '@/component/FullScreenLoader';

export default function ErrorPage() {
  return (
    <Suspense fallback={FullScreenLoader()}>
      <ErrorPageClient />
    </Suspense>
  );
}
