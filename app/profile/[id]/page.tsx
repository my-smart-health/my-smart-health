import Link from "next/link";

import { auth } from "@/auth";

import { Certificate, Schedule } from "@/utils/types";

import ProfileFull from "@/components/profile/profile-full/ProfileFull";
import GoBack from "@/components/buttons/go-back/GoBack";
import prisma from "@/lib/db";

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
      bio: true,
      socials: true,
      website: true,
      fieldOfExpertise: true,
      displayEmail: true,
      schedule: true,
      locations: true,
      certificates: true,
    },
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

  const safeUser = { ...user, schedule: safeSchedule, certificates: safeCertificates };

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