import prisma from "@/lib/db";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { CACHE_STRATEGY } from "@/utils/constants";

import { FieldOfExpertise, Membership, ReservationLink, Schedule } from "@/utils/types";
import EditProfileForm from "@/components/profile/edit-profile-form/EditProfileForm";

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
      fieldOfExpertise: true,
      schedule: true,
      phones: true,
      certificates: true,
      locations: true,
      reservationLinks: true,
      membership: true,
      ratingStars: true,
      ratingLink: true,
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
  });

  return { user } as { user: NonNullable<typeof user> };
}

export default async function EditProfileId({ params }: { params: Promise<{ id: string }> }) {
  const session: Session | null = await auth();
  const { id } = await params;

  if (!session) {
    redirect("/login");
  }

  if (!id) {
    redirect("/dashboard");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { user } = await getData(id);

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
    const reservationLinks: ReservationLink[] = Array.isArray(location.reservationLinks)
      ? (location.reservationLinks as unknown[]).filter(
        (link): link is ReservationLink => {
          if (typeof link !== "object" || link === null) return false;
          const url = (link as Record<string, unknown>).url;
          return typeof url === "string" && url.trim().length > 0;
        }
      )
      : [];

    return {
      ...location,
      schedule,
      reservationLinks,
    };
  });

  const safeField = Array.isArray(parsedUser.fieldOfExpertise) ? (parsedUser.fieldOfExpertise as unknown as FieldOfExpertise[]) : [];
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
    fieldOfExpertise: safeField,
    reservationLinks: safeReservationLinks,
    membership: safeMembership,
    ratingStars: user.ratingStars ?? null,
    ratingLink: user.ratingLink ?? null,
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-primary mb-6">Edit Profile</h1>
      <EditProfileForm user={safeUser} />
    </>
  );
}
