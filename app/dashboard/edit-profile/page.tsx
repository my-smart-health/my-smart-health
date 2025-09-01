import { Session } from "next-auth";
import { redirect } from "next/navigation";
import EditProfileForm from "./EditProfileForm";
import { auth } from "@/auth";
import prisma from "@/lib/db";

async function getData(sessionId: string) {
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      name: true,
      image: true,
      address: true,
      bio: true,
      displayEmail: true,
      phone: true,
      website: true,
      socials: true,
      fieldOfExpertise: true,
    },
  });

  return { user } as { user: NonNullable<typeof user> };
}

export default async function EditProfile() {
  const session: Session | null = await auth();

  if (!session) {
    redirect("/login");
  }

  const { user } = await getData(session.user.id);

  return (
    <main className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 max-w-[90%] text-wrap break-normal">
      <h1 className="text-4xl font-extrabold text-primary mb-6">Edit Profile</h1>
      <EditProfileForm user={user} />
    </main>
  );
}
