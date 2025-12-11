import { auth } from "@/auth";
import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";

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

export default async function Navbar() {
  const unreadCount = await getUnreadNotifications();

  return (
    <>
      <nav
        draggable={false}
        className="flex flex-col mx-auto w-full max-w-[90%]"
      >
        <div className="flex flex-row gap-1 items-center justify-evenly">
          <Link
            draggable={false}
            href="/"
            className="flex items-center"
          >
            <Image
              priority
              loading="eager"
              draggable={false}
              src="/navbar3.png"
              alt="My Smart Health"
              width={256}
              height={112}
              className="w-64 h-auto my-3 mx-auto"
            />
            <span className="ml-2 text-xl font-bold uppercase sr-only">My Smart Health</span>
          </Link>
        </div>
      </nav>
      <ProfileMenu unreadNotifications={unreadCount} />
    </>
  );
}