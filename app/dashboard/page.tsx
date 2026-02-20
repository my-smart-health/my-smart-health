import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CACHE_STRATEGY } from "@/utils/constants";

import {
  Certificate,
  FieldOfExpertise,
  HealthInsurances,
  Membership,
  MyDoctors,
  MemberProfileDashboardProps,
  ReservationLink,
  Schedule,
  Anamneses,
  FileWithDescription,
} from "@/utils/types";

import GoToButton from "@/components/buttons/go-to/GoToButton";
import ProfileFull from "@/components/profile/profile-full/ProfileFull";
import ProfileFullMember from "@/components/profile/profile-full-member/ProfileFullMember";

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
      profileFiles: true,
      membership: true,
      ratingStars: true,
      ratingLink: true,
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
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
    cacheStrategy: CACHE_STRATEGY.NONE,
  });

  return posts;
}

async function getMemberByUserId(userId: string) {
  const member = await prisma.memberProfile.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      birthday: true,
      heightCm: true,
      weightKg: true,
      healthInsurances: true,
      bloodType: true,
      bloodTypeFiles: true,
      anamneses: true,
      documents: true,
      doctors: true,
      familyMembers: true,
      isActive: true,
      activeUntil: true,
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
  });

  if (!member) return null;

  const safeMember: MemberProfileDashboardProps = {
    ...member,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
    birthday: member.birthday ? member.birthday.toISOString() : null,
    activeUntil: member.activeUntil ? member.activeUntil.toISOString() : null,
    heightCm: member.heightCm ? Number(member.heightCm.toString()) : null,
    weightKg: member.weightKg ? Number(member.weightKg.toString()) : null,
    healthInsurances: Array.isArray(member.healthInsurances)
      ? (member.healthInsurances as unknown as HealthInsurances[])
      : [],
    doctors: Array.isArray(member.doctors)
      ? (member.doctors as unknown as MyDoctors[])
      : [],
    anamneses: Array.isArray(member.anamneses)
      ? (member.anamneses as unknown as Anamneses[])
      : [],
    bloodTypeFiles: Array.isArray(member.bloodTypeFiles)
      ? member.bloodTypeFiles.map((file: unknown) => {
        if (typeof file === 'string') {
          return { url: file };
        }
        return file as { url: string; description?: string };
      })
      : [],
    documents: Array.isArray(member.documents)
      ? (member.documents as unknown as FileWithDescription[])
      : [],
    familyMembers: Array.isArray(member.familyMembers)
      ? (member.familyMembers as { name: string; phones: string[] }[])
      : [],
  };

  return safeMember;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/login");
  }

  const user = await getUser(session.user.id);
  const member = await getMemberByUserId(session.user.id);

  if (!user && !member) {
    return (
      <>
        <div>User not found</div>
      </>
    );
  }

  if (member) {

    return (
      <>
        <h1 className="mx-3 text-4xl font-extrabold text-primary">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-3 mb-2 border border-primary p-4 rounded-lg shadow-lg">
          <GoToButton
            src="/dashboard/edit-member"
            name="Edit Member Profile"
            className="btn btn-outline btn-warning hover:text-white shadow"
          />
        </div>
        <ProfileFullMember member={member} />
      </>
    );
  }

  if (user) {
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

    const safeProfileFiles = Array.isArray((user as unknown as { profileFiles?: unknown }).profileFiles)
      ? ((user as unknown as { profileFiles: string[] }).profileFiles)
      : [];

    const safeMembership: Membership | null = user.membership && typeof user.membership === 'object' && 'status' in user.membership && 'link' in user.membership
      ? user.membership as Membership
      : null;

    const safeUser = {
      ...user,
      schedule: safeSchedule,
      certificates: safeCertificates,
      fieldOfExpertise: safeFieldOfExpertise,
      reservationLinks: safeReservationLinks,
      locations: safeLocations,
      profileFiles: safeProfileFiles,
      membership: safeMembership,
      ratingStars: user.ratingStars ?? null,
      ratingLink: user.ratingLink ?? null,
    };

    return (
      <>
        <h1 className="mx-3 text-4xl font-extrabold text-primary">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-3 mb-2 border border-primary p-4 rounded-lg shadow-lg">
          <GoToButton src="/dashboard/all-posts" name="All Posts" className="btn btn-outline btn-info hover:text-white shadow" />
          <GoToButton src="/dashboard/edit-profile" name="Edit Profile" className="btn btn-outline btn-warning hover:text-white shadow" />
          <GoToButton src="/dashboard/create-post" name="New Post" className="btn btn-outline btn-success hover:text-white shadow" />
        </div>

        {session.user.role === "ADMIN" && (
          <div className="flex flex-col gap-3 mb-2 border border-primary p-4 rounded-lg shadow-lg">
            <span className="font-bold self-center">Admin Only</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <GoToButton src="/dashboard/all-users" name="All Users" className="btn btn-outline btn-info hover:text-white" />
              <GoToButton src="/dashboard/all-members" name="All Members" className="btn btn-outline btn-info hover:text-white" />
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
}
