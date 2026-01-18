import { Suspense } from 'react';
import { FullScreenLoader } from '../../component/FullScreenLoader';
import ThankYouPage from './thankYouClient';

export default function ErrorPage() {
  return (
    <Suspense fallback={FullScreenLoader()}>
      <ThankYouPage />
    </Suspense>
  );
}
