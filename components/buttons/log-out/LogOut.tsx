'use client'

import { signOut } from "next-auth/react";

export default function LogOut() {
  return (
    <button
      className="btn btn-outline btn-error hover:text-white"
      onClick={() => signOut({ redirect: true, redirectTo: '/' })}>
      Logout
    </button>
  );
}
