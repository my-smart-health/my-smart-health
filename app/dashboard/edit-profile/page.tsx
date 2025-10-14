import { auth } from "@/auth";
import { Session } from "next-auth";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";

import EditProfileForm from "@/components/profile/edit-profile-form/EditProfileForm";
import Link from "next/link";
import { Schedule } from "@/utils/types";

async function getData(sessionId: string) {
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      name: true,
      profileImages: true,
      bio: true,
      displayEmail: true,
      website: true,
      socials: true,
      phones: true,
      fieldOfExpertise: true,
      schedule: true,
      certificates: true,
      locations: true,
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


  const fixedLocations = parsedUser.locations.map((loc) => {
    let schedule: Schedule[] = [];
    if (Array.isArray(loc.schedule)) {
      schedule = loc.schedule.filter((s) => s !== null) as Schedule[];
    } else if (typeof loc.schedule === "string") {
      try {
        const parsed = JSON.parse(loc.schedule);
        schedule = Array.isArray(parsed) ? parsed.filter((s) => s !== null) as Schedule[] : [];
      } catch {
        schedule = [];
      }
    } else if (loc.schedule !== null && typeof loc.schedule === "object") {
      schedule = [loc.schedule as Schedule].filter((s) => s !== null) as Schedule[];
    }
    return {
      ...loc,
      schedule,
    };
  });

  const fixedUser = { ...parsedUser, locations: fixedLocations };

  return (
    <>
      <Link href="/dashboard/change-password" className="self-start ml-2 text-sm text-primary">
        Change Password
      </Link>
      <h1 className="text-4xl font-extrabold text-primary mb-6">Edit Profile</h1>
      <EditProfileForm user={fixedUser} />
    </>
  );
}
