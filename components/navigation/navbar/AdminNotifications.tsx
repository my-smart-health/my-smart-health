import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Bell, BellRing } from "lucide-react";
import Link from "next/link";

async function getUnreadCount(isAdmin: boolean) {
  if (!isAdmin) return 0;

  const count = await prisma.adminNotification.count({
    where: {
      isRead: false,
      archivedAt: null,
    },
  });

  return count;
}

export default async function AdminNotifications() {
  const session = await auth();

  if (!session) return null;
  if (session?.user.role !== "ADMIN") return null;

  const unreadCount = await getUnreadCount(session.user.role === "ADMIN");

  return (
    <Link href="/dashboard/password-requests" className="relative p-4 hover:bg-base-200 rounded-lg transition-colors">
      {unreadCount > 0 ? (
        <>
          <BellRing className="text-primary animate-[swing_1s_ease-in-out_infinite]" />
          <span className="absolute top-2 right-2 bg-error text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </>
      ) : (
        <Bell />
      )}
    </Link>
  );
}
