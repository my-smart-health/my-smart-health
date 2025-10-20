import { auth } from "@/auth";
import ChangePasswordForm from "@/components/forms/change-password/ChangePasswordForm";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

function getUser(id: string) {
  const user = prisma.user.findUnique({
    where: { id },
    select: { password: true },
  });
  return user;
}

export default async function ChangePasswordPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const currentUser = await getUser(session.user.id);

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-primary mb-6">Change Password</h1>
      <ChangePasswordForm user={currentUser} />
    </div>
  );
}