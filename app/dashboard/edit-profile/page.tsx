import { Session } from "next-auth";
import { redirect } from "next/navigation";
import EditProfileForm from "../../../components/profile/edit-profile-form/EditProfileForm";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import Link from "next/link";

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

export default async function EditProfile() {
  const session: Session | null = await auth();

  if (!session) {
    redirect("/login");
  }

  const { user } = await getData(session.user.id);

  const parsedUser = {
    ...user,
    schedule: typeof user.schedule === "string" ? JSON.parse(user.schedule) : user.schedule,
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-primary mb-6">Edit Profile</h1>
      <EditProfileForm user={parsedUser} />
      {
        session?.user?.role === "ADMIN" && parsedUser.id !== session.user.id && (
          <div
            className="text-sm text-gray-500 italic mt-4">
            <Link
              href={`/dashboard/edit-profile/${user.id}`}
              className="btn btn-warning underline">
              Edit profile
            </Link>
            <p className="mt-2">
              Note: You are logged in as an admin. You can edit any user&apos;s profile from the admin dashboard.
            </p>
          </div>
        )}
    </>
  );
}
