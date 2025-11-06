import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Certificate, FieldOfExpertise, ReservationLink, Schedule } from "@/utils/types";

import GoToButton from "@/components/buttons/go-to/GoToButton";
import ProfileFull from "@/components/profile/profile-full/ProfileFull";

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profileImages: true,
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
  });
  return user;
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
  });

  return posts;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/login");
  }

  const user = await getUser(session.user.id);

  if (!user) {
    return (
      <>
        <div>User not found</div>
      </>
    );
  }

  const posts = await getAllPosts(user.id);

  const safeSchedule: Schedule[] = Array.isArray(user.schedule)
    ? (user.schedule as Schedule[])
    : [];
  const safeCertificates: Certificate[] = Array.isArray(user.certificates)
    ? (user.certificates as unknown as Certificate[])
    : [];
  const safeFieldOfExpertise: FieldOfExpertise[] = Array.isArray(user.fieldOfExpertise)
    ? (user.fieldOfExpertise as unknown as FieldOfExpertise[])
    : [];
  const safeReservationLinks: ReservationLink[] = Array.isArray(user.reservationLinks)
    ? (user.reservationLinks as ReservationLink[])
    : [];

  const safeLocations = (user.locations || []).map((location) => {
    let schedule: Schedule[] = [];
    if (Array.isArray(location.schedule)) {
      schedule = location.schedule.filter((item) => item !== null) as Schedule[];
    } else if (typeof location.schedule === "string") {
      try {
        const parsed = JSON.parse(location.schedule);
        schedule = Array.isArray(parsed) ? (parsed.filter((scheduleItem: unknown) => scheduleItem !== null) as Schedule[]) : [];
      } catch {
        schedule = [];
      }
    } else if (location.schedule !== null && typeof location.schedule === "object") {
      schedule = [location.schedule as unknown as Schedule].filter((item) => item !== null) as Schedule[];
    }

    const locLinksUnknown = (location as unknown as { reservationLinks?: unknown }).reservationLinks;
    const reservationLinks: ReservationLink[] = Array.isArray(locLinksUnknown)
      ? (locLinksUnknown as ReservationLink[]).filter((link) => link && typeof link.url === "string" && link.url.trim().length > 0)
      : [];

    return { ...location, schedule, reservationLinks };
  });

  const safeUser = {
    ...user,
    schedule: safeSchedule,
    certificates: safeCertificates,
    fieldOfExpertise: safeFieldOfExpertise,
    reservationLinks: safeReservationLinks,
    locations: safeLocations,
  };

  return (
    <>
      <h1 className="mx-3 text-4xl font-extrabold text-primary mb-6">Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 border border-primary p-4 rounded-lg shadow-lg">
        <GoToButton src="/dashboard/all-posts" name="All Posts" className="btn btn-outline btn-info hover:text-white shadow" />
        <GoToButton src="/dashboard/edit-profile" name="Edit Profile" className="btn btn-outline btn-warning hover:text-white shadow" />
        <GoToButton src="/dashboard/create-post" name="New Post" className="btn btn-outline btn-success hover:text-white shadow" />
      </div>

      {session.user.role === "ADMIN" && (
        <div className="flex flex-col gap-4 mb-8 border border-primary p-4 rounded-lg shadow-lg">
          <span className="font-bold self-center">Admin Only</span>
          <div className="flex flex-col sm:flex-row gap-2">
            <GoToButton src="/dashboard/all-users" name="All Users" className="btn btn-outline btn-info hover:text-white" />
            <GoToButton src="/dashboard/edit-cube" name="Edit Cube" className="btn btn-outline btn-success hover:text-white shadow" />
            <GoToButton src="/dashboard/edit-my-smart-health" name="Edit My Smart Health" className="btn btn-outline btn-success hover:text-white shadow" />
            <GoToButton src="/register" name="Create new account" className="btn btn-outline btn-error hover:text-white" />
          </div>
        </div>
      )}

      <ProfileFull user={safeUser} posts={posts} />
    </>
  );
}
