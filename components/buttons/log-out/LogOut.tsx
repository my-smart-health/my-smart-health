'use client'

import { signOut } from "next-auth/react";

export default function LogOut({ addClasses }: { addClasses?: string }) {
  return (
    <button
      className={` ${addClasses}`}
      onClick={() => signOut({ redirect: true, redirectTo: '/' })}>
      Logout
    </button>
  );
}
