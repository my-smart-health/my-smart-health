'use client'

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogOut({ addClasses }: { addClasses?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });

    if (typeof window !== 'undefined') {
      console.log('Clearing localStorage and cookies on logout');

      try {
        sessionStorage.clear();
      } catch (err) {
        console.warn('Failed to clear sessionStorage:', err);
      }

      if ('cookieStore' in window && window.cookieStore) {
        try {
          await window.cookieStore.delete('__Secure-YEC');
          await window.cookieStore.delete('lastActivity');
        } catch (err) {
          console.warn('Failed to delete cookies via cookieStore:', err);
        }
      }

      try {
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('activityChecksum');
        localStorage.removeItem('nextauth.message');
        document.cookie = `lastActivity=; Max-Age=0; path=/; SameSite=Lax`;
      } catch (err) {
        console.warn('Failed to clear localStorage/cookies:', err);
      }

      console.log('localStorage after clear:', localStorage.getItem('lastActivity'), localStorage.getItem('activityChecksum'));
    }

    router.push('/');
  };

  return (
    <button
      className={` ${addClasses}`}
      onClick={handleLogout}>
      Logout
    </button>
  );
}
