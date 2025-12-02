'use client'

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogOut({ addClasses }: { addClasses?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });

    if (typeof window !== 'undefined') {
      console.log('Clearing localStorage and cookies on logout');
      sessionStorage.clear();
      cookieStore.delete("__Secure-YEC");
      cookieStore.delete("lastActivity");
      localStorage.removeItem('lastActivity');
      localStorage.removeItem('activityChecksum');
      localStorage.removeItem('nextauth.message');
      document.cookie = `lastActivity=; Max-Age=0; path=/; SameSite=Lax`;
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
