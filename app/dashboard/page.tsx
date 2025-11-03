import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Certificate, FieldOfExpertise, Schedule } from "@/utils/types";

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

  const safeUser = {
    ...user,
    schedule: Array.isArray(user.schedule)
      ? user.schedule as Schedule[]
      : [],
    certificates: Array.isArray(user.certificates)
      ? user.certificates as unknown as Certificate[]
      : [],
    fieldOfExpertise: Array.isArray(user.fieldOfExpertise)
      ? user.fieldOfExpertise as unknown as FieldOfExpertise[]
      : [],
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
