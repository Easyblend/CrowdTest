import { Suspense } from 'react';
import ErrorPageClient from './ErrorPageClient';
import { FullScreenLoader } from '@/app/component/FullScreenLoader';

export default function ErrorPage() {
  return (
    <Suspense fallback={FullScreenLoader()}>
      <ErrorPageClient />
    </Suspense>
  );
}
