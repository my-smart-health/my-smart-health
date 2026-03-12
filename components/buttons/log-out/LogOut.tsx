'use client'

import { signOut } from "next-auth/react";

export default function LogOut({ addClasses }: { addClasses?: string }) {
  const clearAccessibleCookies = () => {
    if (typeof document === 'undefined') return;

    const cookieNames = document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0]?.trim())
      .filter(Boolean) as string[];

    const hostname = typeof window !== 'undefined' ? window.location.hostname : undefined;

    cookieNames.forEach((cookieName) => {
      document.cookie = `${cookieName}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${cookieName}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
      document.cookie = `${cookieName}=; Max-Age=0; path=/; SameSite=Lax; Secure`;

      if (hostname) {
        document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=${hostname}; SameSite=Lax`;
        document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=.${hostname}; SameSite=Lax`;
      }
    });
  };

  const handleLogout = async () => {
    try {
      const result = await signOut({ callbackUrl: '/', redirect: false });

      if (typeof window !== 'undefined') {

        localStorage.removeItem('lastActivity');
        localStorage.removeItem('activityChecksum');
        localStorage.removeItem('nextauth.message');

        sessionStorage.clear();
        clearAccessibleCookies();

        if (process.env.NODE_ENV === 'development') console.log('Client storage cleared');

        window.location.href = result?.url || '/';
      }

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
