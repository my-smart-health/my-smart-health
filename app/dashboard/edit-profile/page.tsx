import prisma from "@/lib/db";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { CACHE_STRATEGY } from "@/utils/constants";

import EditProfileForm from "@/components/profile/edit-profile-form/EditProfileForm";
import { FieldOfExpertise, Membership, ReservationLink, Schedule } from "@/utils/types";

async function getData(sessionId: string) {
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      name: true,
      profileImages: true,
      profileFiles: true,
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
      membership: true,
      ratingStars: true,
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
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
    const locLinksUnknown = (location as unknown as { reservationLinks?: unknown }).reservationLinks;
    const reservationLinks: ReservationLink[] = Array.isArray(locLinksUnknown)
      ? (locLinksUnknown as ReservationLink[]).filter(
        (link) => link && typeof link.url === "string" && link.url.trim().length > 0
      )
      : [];

    return {
      ...location,
      schedule,
      reservationLinks,
    };
  });
  const safeFieldsOfExpertise = Array.isArray(parsedUser.fieldOfExpertise)
    ? (parsedUser.fieldOfExpertise as unknown as FieldOfExpertise[])
    : [];
  const safeReservationLinks: ReservationLink[] = Array.isArray(user.reservationLinks)
    ? (user.reservationLinks as ReservationLink[])
    : [];
  const safeProfileFiles = Array.isArray(user.profileFiles) ? user.profileFiles : [];
  const safeMembership: Membership | null = user.membership && typeof user.membership === 'object' && 'status' in user.membership && 'link' in user.membership
    ? user.membership as Membership
    : null;

  const safeUser = {
    ...parsedUser,
    profileFiles: safeProfileFiles,
    locations: safeLocations,
    fieldOfExpertise: safeFieldsOfExpertise,
    reservationLinks: safeReservationLinks,
    membership: safeMembership,
    ratingStars: user.ratingStars ?? null,
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-primary mb-6">Edit Profile</h1>
      <EditProfileForm user={safeUser} />
    </>
  );
}
