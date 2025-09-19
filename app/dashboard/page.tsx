import { redirect } from "next/navigation";

import prisma from "@/lib/db";
import { auth } from "@/auth";

import { Certificate, Schedule } from "@/utils/types";

import GoToButton from "@/components/buttons/go-to/GoToButton";
import ProfileFull from "@/components/profile/profile-full/ProfileFull";
import CreateNewAccount from "@/components/buttons/create-new-account/CreateNewAccount";
import GoBack from "@/components/buttons/go-back/GoBack";


async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      profileImages: true,
      address: true,
      bio: true,
      phone: true,
      socials: true,
      website: true,
      fieldOfExpertise: true,
      displayEmail: true,
      schedule: true,
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
      <main className="flex flex-col items-center justify-center gap-3 w-full mb-auto max-w-[100%]">
        <div>User not found</div>
        <GoBack />
      </main>
    );
  }

  const posts = await getAllPosts(user.id);

  const safeUser = user
    ? {
      ...user,
      schedule: Array.isArray(user.schedule)
        ? user.schedule as Schedule[]
        : [],
      certificates: Array.isArray(user.certificates)
        ? user.certificates as unknown as Certificate[]
        : []
    }
    : null;

  return (
    <main className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-x-none">

      <h1 className="mx-3 text-4xl font-extrabold  text-primary mb-6">Welcome, {user?.name || "User"}!</h1>

      <div className="flex gap-4 mb-8 border border-primary p-4 rounded-lg shadow-lg">
        <CreateNewAccount session={session} />
        <GoToButton src="/dashboard/edit-profile" name="Edit Profile" className="btn btn-outline btn-warning hover:text-white shadow" />
        <GoToButton src="/dashboard/create-post" name="New Post" className="btn btn-outline btn-success hover:text-white shadow" />
      </div>

      {safeUser && <ProfileFull user={safeUser} posts={posts} />}

    </main >
  );
}
