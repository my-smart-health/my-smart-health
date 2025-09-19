import { Session } from "next-auth";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import EditProfileForm from "../../../../components/profile/edit-profile-form/EditProfileForm";

async function getData(sessionId: string) {
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      name: true,
      profileImages: true,
      address: true,
      bio: true,
      displayEmail: true,
      phone: true,
      website: true,
      socials: true,
      fieldOfExpertise: true,
      schedule: true,
      certificates: true,
    },
  });

  return { user } as { user: NonNullable<typeof user> };
}

export default async function EditProfileId({ params }: { params: Promise<{ id: string }> }) {
  const session: Session | null = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { user } = await getData((await params).id);

  const parsedUser = {
    ...user,
    schedule: typeof user.schedule === "string" ? JSON.parse(user.schedule) : user.schedule,
  };

  return (
    <main className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 max-w-[90%] text-wrap break-normal">
      <h1 className="text-4xl font-extrabold text-primary mb-6">Edit Profile</h1>
      <EditProfileForm user={parsedUser} />
    </main>
  );
}
