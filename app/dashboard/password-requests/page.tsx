import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PasswordRequestsList from "./_components/PasswordRequestsList";
import RefreshNotifications from "./_components/RefreshNotifications";
import prisma from "@/lib/db";
import { AdminNotification } from "@/utils/types";

export default async function PasswordRequestsPage() {
  const session = await auth();

  if (!session || session?.user.role !== "ADMIN") {
    redirect("/");
  }

  const notificationsData = await prisma.adminNotification.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const notifications: AdminNotification[] = notificationsData.map((n) => ({
    id: n.id,
    message: n.message,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
    resetReadAt: n.resetReadAt ? n.resetReadAt.toISOString() : null,
    archivedAt: n.archivedAt ? n.archivedAt.toISOString() : null,
  }));

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Passwort-Zurücksetzungsanfragen</h1>
          <p className="text-gray-600">
            Verwalten Sie Anfragen zum Zurücksetzen von Passwörtern
          </p>
        </div>
        <RefreshNotifications />
      </div>

      <PasswordRequestsList initialNotifications={notifications} />
    </div>
  );
}
