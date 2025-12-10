'use client';

import { Settings, Bell, BellRing } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LogOut from "@/components/buttons/log-out/LogOut";

interface ProfileMenuProps {
  unreadNotifications?: number;
}

export default function ProfileMenu({ unreadNotifications = 0 }: ProfileMenuProps) {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="flex flex-row justify-evenly items-center h-full max-h-fit w-full max-w-[100%] gap-1 sm:gap-2 bg-primary text-white p-2 mb-4">
      <div className="flex text-wrap min-w-0 flex-1 items-center">
        <span className="hidden sm:inline">Welcome, </span>
        <Link
          href={`/dashboard`}
          className="font-semibold hover:underline sm:ml-1 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
          {session.user?.email}
        </Link>
      </div>

      {session.user.role === "ADMIN" && (
        <Link href="/dashboard/password-requests" className="relative p-2 sm:p-4 rounded-lg transition-colors flex-shrink-0">
          {unreadNotifications > 0 ? (
            <>
              <BellRing className="text-white animate-[swing_1s_ease-in-out_infinite] w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-error text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            </>
          ) : (
            <Bell className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </Link>
      )}

      <div className="border border-white h-6 w-0 text-transparent flex-shrink-0">.</div>

      <div className="dropdown dropdown-end flex-shrink-0">
        <div tabIndex={0} role="button" className="btn btn-circle btn-sm sm:btn-md m-1 sm:m-2 border-2 border-white bg-primary"><Settings className="text-white spin-slow w-4 h-4 sm:w-5 sm:h-5" /></div>
        <ul tabIndex={0} className="dropdown-content menu bg-primary border rounded-box z-1 w-52 p-2 shadow-sm transition-opacity ease-in-out">
          <li><Link href="/" className="flex gap-1">Home</Link></li>
          <li><Link href="/dashboard" className="flex gap-1">Dashboard</Link></li>
          <li className="tab-disabled"></li>
          <li><Link href="/dashboard/all-posts" className="flex gap-1">All Posts</Link></li>
          <li><Link href="/dashboard/create-post" className="flex gap-1">Create Post</Link></li>
          <li className="tab-disabled"></li>
          <li><Link href="/dashboard/edit-profile" className="flex gap-1">Edit profile</Link></li>
          <li>
            <Link href="/dashboard/change-email" className="flex gap-1">
              Change Email
            </Link>
          </li>
          <li>
            <Link href="/dashboard/change-password" className="flex gap-1">
              Change Password
            </Link>
          </li>
          <li className="tab-disabled"></li>
          {session.user.role === "ADMIN" && (
            <>
              <span className="font-bold self-center">Admin Only</span>
              <li><Link href="/dashboard/all-users" className="flex gap-1">All Users</Link></li>
              <li><Link href="/dashboard/edit-cube" className="flex gap-1">Edit Cube</Link></li>
              <li><Link href="/dashboard/edit-my-smart-health" className="flex gap-1">Edit My Smart Health</Link></li>
              <li><Link href="/register" className="flex gap-1">Create new user</Link></li>
              <li className="tab-disabled"></li>
            </>
          )
          }
          <li className="my-2"><LogOut /></li>
        </ul>
      </div>
    </div>
  );
}