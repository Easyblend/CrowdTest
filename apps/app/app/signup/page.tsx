import { redirect } from 'next/navigation';
import SignupPage from './signup';

export default async function Page() {
   redirect("/");
  return <SignupPage />;                
}
