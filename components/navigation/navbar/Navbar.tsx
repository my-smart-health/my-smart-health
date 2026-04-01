import { auth } from "@/auth";
import { getTranslations } from 'next-intl/server';
import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";
import LogOut from "@/components/buttons/log-out/LogOut";
import LocalePicker from "@/components/navigation/locale/LocalePicker";

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
async function isLogged(loginText: string) {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex flex-col ml-auto items-center gap-2">
        <LocalePicker />
        <Link href="/login" className="hover:underline capitalize p-2 border-l-2 border-primary h-10 text-primary">
          {loginText}
        </Link>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row items-center gap-2">
        <LocalePicker />
        <LogOut addClasses="ml-auto link link-error p-2 border-l-2 border-primary h-10" />
      </div>
    );
  }
}
export default async function Navbar() {
  const t = await getTranslations('Navbar');
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
              preload
              draggable={false}
              src="/navbar_v4.png"
              alt={t('srOnly')}
              width={356}
              height={112}
              className="w-auto h-auto my-3 mx-auto"
            />
            <span className="ml-2 text-xl font-bold uppercase sr-only">{t('srOnly')}</span>
          </Link>
          {await isLogged(t('login'))}
        </div>
      </nav>
      <ProfileMenu unreadNotifications={unreadCount} />
    </>
  );
}