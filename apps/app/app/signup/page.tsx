// app/login/page.tsx
import { redirect } from 'next/navigation';
import LoginPage from './signup';

export default async function Page() {
  redirect("/");
  return <LoginPage />;
}
