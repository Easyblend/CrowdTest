// app/login/page.tsx
import { redirect } from 'next/navigation';
import LoginPage from './login';

export default async function Page() {
  redirect("/");
  return <LoginPage />;
}
