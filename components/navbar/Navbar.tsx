import Image from "next/image";
import Link from "next/link";
import NotrufDropdown from "./NotrufDropdown";
import LogOut from "../buttons/log-out/LogOut";
import { Settings } from "lucide-react";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();
  return (
    <>
      <nav
        draggable={false}
        className="flex flex-col mx-auto mb-1 w-full max-w-[90%]"
      >
        <div className="flex flex-row gap-1 items-center justify-evenly text-start text-nowrap">
          <Link
            draggable={false}
            href="/"
            className="flex flex-col items-start sm:items-center"
          >
            <div className="flex flex-row items-center justify-center text-xl font-bold uppercase">
              <Image
                priority
                loading="eager"
                draggable={false}
                src="/og-logo.jpg"
                alt="My Smart Health"
                width={350}
                height={112}
                className="w-96 h-auto mx-auto"
              />
            </div>
          </Link>
          <NotrufDropdown />
        </div>
      </nav>
      {session &&
        <div className="flex flex-row justify-evenly align-baseline h-full max-h-fit w-full max-w-[90%] gap-2 bg-primary text-white p-2 mb-4">
          <div className="flex text-wrap m-auto">Welcome, {session.user?.email}</div>

          <div className="border border-white h-full w-0 my-4 text-transparent">.</div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-circle m-2 border-2 border-white bg-primary"><Settings className="text-white" /></div>
            <ul tabIndex={0} className="dropdown-content menu bg-primary rounded-box z-1 w-52 p-2 shadow-sm">
              <li><Link href="/" className="flex gap-1">Home</Link></li>
              <li><Link href="/dashboard" className="flex gap-1">Dashboard</Link></li>
              <li><Link href="/dashboard/create-news" className="flex gap-1">Create News</Link></li>
              <li><Link href="/dashboard/edit-profile" className="flex gap-1">Edit profile</Link></li>
              <li className="mt-4"><LogOut /></li>
            </ul>
          </div>
        </div>
      }
    </>
  )
}