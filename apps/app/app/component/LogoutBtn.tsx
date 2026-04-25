'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

export default function LogoutBtn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error('Logout failed. Please try again.');
      setIsLoading(false);
      return;
    }

    router.push('/login');
    router.refresh(); // important to clear server state
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}