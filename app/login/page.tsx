// app/login/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import LoginPage from './login';

export default async function Page() {
  return <LoginPage />;
}
