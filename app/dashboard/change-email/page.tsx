import { auth } from "@/auth";
import ChangeEmailForm from "@/components/forms/change-email/ChangeEmailForm";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

async function getUserEmail(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { email: true },
  });
  return user;
}

export default async function ChangeEmailPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const currentUser = await getUserEmail(session.user.id);

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-primary mb-6">Change Email</h1>
      <ChangeEmailForm currentEmail={currentUser.email} />
    </div>
  );
}
