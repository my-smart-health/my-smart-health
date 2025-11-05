import prisma from "@/lib/db";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

import EditProfileForm from "@/components/profile/edit-profile-form/EditProfileForm";
import { FieldOfExpertise, ReservationLink, Schedule } from "@/utils/types";

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
      reservationLinks: true,
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


  const safeLocations = parsedUser.locations.map((location) => {
    let schedule: Schedule[] = [];
    if (Array.isArray(location.schedule)) {
      schedule = location.schedule.filter((scheduleItem) => scheduleItem !== null) as Schedule[];
    } else if (typeof location.schedule === "string") {
      try {
        const parsed = JSON.parse(location.schedule);
        schedule = Array.isArray(parsed) ? parsed.filter((scheduleItem) => scheduleItem !== null) as Schedule[] : [];
      } catch {
        schedule = [];
      }
    } else if (location.schedule !== null && typeof location.schedule === "object") {
      schedule = [location.schedule as Schedule].filter((scheduleItem) => scheduleItem !== null) as Schedule[];
    }
    return {
      ...location,
      schedule,
    };
  });
  const safeFieldsOfExpertise = Array.isArray(parsedUser.fieldOfExpertise)
    ? (parsedUser.fieldOfExpertise as unknown as FieldOfExpertise[])
    : [];
  const safeReservationLinks: ReservationLink[] = Array.isArray(user.reservationLinks)
    ? (user.reservationLinks as ReservationLink[])
    : [];

  const safeUser = {
    ...parsedUser,
    locations: safeLocations,
    fieldOfExpertise: safeFieldsOfExpertise,
    reservationLinks: safeReservationLinks,
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-primary mb-6">Edit Profile</h1>
      <EditProfileForm user={safeUser} />
    </>
  );
}
