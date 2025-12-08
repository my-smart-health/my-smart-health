'use client'

import { signOut } from "next-auth/react";

export default function LogOut({ addClasses }: { addClasses?: string }) {

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {

        localStorage.removeItem('lastActivity');
        localStorage.removeItem('activityChecksum');
        localStorage.removeItem('nextauth.message');

        sessionStorage.clear();

        const cookies = [
          'lastActivity',
          'authjs.session-token',
          'authjs.callback-url',
          'authjs.csrf-token',
          '__Secure-authjs.session-token',
          '__Host-authjs.csrf-token',
          'next-auth.session-token',
          '__Secure-next-auth.session-token',
        ];

        cookies.forEach(cookieName => {
          document.cookie = `${cookieName}=; Max-Age=0; path=/; SameSite=Lax`;
          document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=${window.location.hostname}; SameSite=Lax`;
          document.cookie = `${cookieName}=; Max-Age=0; path=/; SameSite=Lax; Secure`;
        });

        console.log('Storage and cookies cleared');
      }

      await signOut({ callbackUrl: '/', redirect: true });

    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <button
      className={` ${addClasses}`}
      onClick={handleLogout}>
      Logout
    </button>
  );
}
