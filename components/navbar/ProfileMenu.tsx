import LogOut from "../buttons/log-out/LogOut";
import { Settings } from "lucide-react";
import { auth } from "@/auth";
import Link from "next/link";

export default async function ProfileMenu() {
  const session = await auth();

  return (
    <>
      {session &&
        <div className="flex flex-row justify-evenly align-baseline h-full max-h-fit w-full max-w-[100%] gap-2 bg-primary text-white p-2 mb-4">
          <div className="flex text-wrap m-auto">
            <span>Welcome, </span>
            <Link
              href={`/dashboard`}
              className="font-semibold hover:underline ml-1">
              {session.user?.email}
            </Link>
          </div>

          <div className="border border-white h-full w-0 my-4 text-transparent">.</div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-circle m-2 max-sm:ml-0 border-2 border-white bg-primary"><Settings className="text-white spin-slow" /></div>
            <ul tabIndex={0} className="dropdown-content menu bg-primary border rounded-box z-1 w-52 p-2 shadow-sm transition-opacity ease-in-out">
              <li><Link href="/" className="flex gap-1">Home</Link></li>
              <li><Link href="/dashboard" className="flex gap-1">Dashboard</Link></li>
              <li><Link href="/dashboard/edit-profile" className="flex gap-1">Edit profile</Link></li>
              <li className="tab-disabled"></li>
              <li><Link href="/dashboard/all-posts" className="flex gap-1">All Posts</Link></li>
              <li><Link href="/dashboard/create-post" className="flex gap-1">Create Post</Link></li>
              <li className="tab-disabled"></li>
              <span className="font-bold self-center">Admin Only</span>
              <li><Link href="/dashboard/all-users" className="flex gap-1">All Users</Link></li>
              <li><Link href="/dashboard/edit-my-smart-health" className="flex gap-1">Edit My Smart Health</Link></li>
              <li><Link href="/register" className="flex gap-1">Register new user</Link></li>
              <li className="tab-disabled"></li>
              <li className="my-2"><LogOut /></li>
            </ul>
          </div>
        </div>
      }
    </>
  );
}