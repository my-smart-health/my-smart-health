import { auth } from "@/auth";
import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";
import LogOut from "@/components/buttons/log-out/LogOut";

async function getUnreadNotifications() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return 0;
  }

  const count = await prisma.adminNotification.count({
    where: {
      isRead: false,
      archivedAt: null,
    },
  });

  return count;
}
async function isLogged() {
  const session = await auth();
  if (!session) {
    return (
      <Link href="/login" className="ml-auto relative top-0 right-0 hover:underline capitalize p-2 border-l-2 border-primary h-10 text-primary">
        Login
      </Link>
    );
  } else {
    return (
      <LogOut addClasses="ml-auto link link-error p-2 border-l-2 border-primary h-10" />
    );
  }
}
export default async function Navbar() {
  const unreadCount = await getUnreadNotifications();

  return (
    <>
      <nav
        draggable={false}
        className="flex flex-col mx-auto w-full max-w-[90%]"
      >
        <div className="flex flex-row gap-1 items-center justify-center">
          <Link
            draggable={false}
            href="/"
            className="flex items-center justify-center ml-auto"
          >
            <Image
              priority
              loading="eager"
              draggable={false}
              src="/navbar_v4.png"
              alt="My Smart Health"
              width={356}
              height={112}
              className="w-auto h-auto my-3 mx-auto"
            />
            <span className="ml-2 text-xl font-bold uppercase sr-only">My Smart Health</span>
          </Link>
          {await isLogged()}
        </div>
      </nav>
      <ProfileMenu unreadNotifications={unreadCount} />
    </>
  );
}