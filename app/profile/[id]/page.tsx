import Link from "next/link";
import prisma from "@/lib/db";
import { auth } from "@/auth";

import { Certificate, FieldOfExpertise, ReservationLink, Schedule } from "@/utils/types";
import { CACHE_STRATEGY } from "@/utils/constants";

import ProfileFull from "@/components/profile/profile-full/ProfileFull";
import GoBack from "@/components/buttons/go-back/GoBack";

function UserNotFound() {
  return (
    <>
      <div>User not found</div>
      <GoBack />
    </>
  );
}

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profileImages: true,
      profileFiles: true,
      bio: true,
      socials: true,
      website: true,
      phones: true,
      fieldOfExpertise: true,
      displayEmail: true,
      schedule: true,
      locations: true,
      certificates: true,
      reservationLinks: true,
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
  });
  return { user };
}

async function getAllPosts(userId: string) {
  const posts = await prisma.posts.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      title: true,
      photos: true,
      authorId: true,
    },
    cacheStrategy: CACHE_STRATEGY.MEDIUM_SHORT,
  });

  return posts;
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  const { id } = await params;
  const { user } = await getUser(id);

  if (!user) {
    return <UserNotFound />;
  }

  const posts = await getAllPosts(user.id);

  if (!user || user === null) {
    return (
      <UserNotFound />
    );
  }
  const safeSchedule = user.schedule ? user.schedule as Schedule[] : [];
  const safeCertificates = user.certificates ? user.certificates as unknown as Certificate[] : [];
  const safeFieldOfExpertise = user.fieldOfExpertise ? user.fieldOfExpertise as unknown as FieldOfExpertise[] : [];
  const safeReservationLinks: ReservationLink[] = Array.isArray(user.reservationLinks)
    ? (user.reservationLinks as ReservationLink[])
    : [];

  const safeLocations = (user.locations || []).map((location) => {
    let schedule: Schedule[] = [];
    if (Array.isArray(location.schedule)) {
      schedule = location.schedule.filter((scheduleItem) => scheduleItem !== null) as Schedule[];
    } else if (typeof location.schedule === "string") {
      try {
        const parsed = JSON.parse(location.schedule);
        schedule = Array.isArray(parsed) ? (parsed.filter((scheduleItem: unknown) => scheduleItem !== null) as Schedule[]) : [];
      } catch {
        schedule = [];
      }
    } else if (location.schedule !== null && typeof location.schedule === "object") {
      schedule = [location.schedule as unknown as Schedule].filter((scheduleItem) => scheduleItem !== null) as Schedule[];
    }

    const locLinksUnknown = (location as unknown as { reservationLinks?: unknown }).reservationLinks;
    const reservationLinks: ReservationLink[] = Array.isArray(locLinksUnknown)
      ? (locLinksUnknown as ReservationLink[]).filter((link) => link && typeof link.url === "string" && link.url.trim().length > 0)
      : [];

    return { ...location, schedule, reservationLinks };
  });
  const safeProfileFiles = Array.isArray(user.profileFiles) ? user.profileFiles : [];

  const safeUser = {
    ...user,
    profileFiles: safeProfileFiles,
    fieldOfExpertise: safeFieldOfExpertise,
    schedule: safeSchedule,
    certificates: safeCertificates,
    reservationLinks: safeReservationLinks,
    locations: safeLocations,
  };

  return (
    <>
      {(session?.user?.role === "ADMIN") && (
        <Link
          href={`/dashboard/edit-profile/${user.id}`}
          className="btn btn-wide btn-warning self-center rounded-xl underline">
          Edit profile
        </Link>
      )}
      <ProfileFull user={safeUser} posts={posts} />
    </>
  );
}