'use client'

import { signOut } from "next-auth/react";

export default function LogOut({ addClasses }: { addClasses?: string }) {
  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      localStorage.removeItem('nextauth.message');
    }

    await signOut({
      callbackUrl: '/',
      redirect: true
    });
  };

  return (
    <button
      className={` ${addClasses}`}
      onClick={handleLogout}>
      Logout
    </button>
  );
}
