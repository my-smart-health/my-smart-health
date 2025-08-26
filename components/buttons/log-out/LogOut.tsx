'use client'

import { signOut } from "next-auth/react";

export default function LogOut() {
  return (
    <button
      className="btn btn-neutral rounded-2xl bg-red-500/85 hover:bg-red-600/85"
      onClick={() => signOut({ redirect: true, redirectTo: '/' })}>
      Logout
    </button>
  );
}
