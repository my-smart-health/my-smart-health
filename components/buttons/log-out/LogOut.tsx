'use client'

import { signOut } from "next-auth/react";

export default function LogOut({ addClasses }: { addClasses?: string }) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <button
      className={` ${addClasses}`}
      onClick={handleLogout}>
      Logout
    </button>
  );
}
