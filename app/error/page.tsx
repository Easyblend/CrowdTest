import { Suspense } from 'react';
import ErrorPageClient from './ErrorPageClient';

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorPageClient />
    </Suspense>
  );
}
