import { redirect } from "next/navigation";

import { auth } from "@/auth";
import prisma from "@/lib/db";

import GoToButton from "@/components/buttons/go-to/GoToButton";
import ProfileFull from "@/components/profile-full/ProfileFull";
import CreateNewAccount from "@/components/buttons/create-new-account/CreateNewAccount";
import ShortPosts from "@/components/posts/short-posts/ShortPosts";

import { Schedule } from "@/utils/types";

async function getData(sessionId: string) {
  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      name: true,
      profileImages: true,
      address: true,
      bio: true,
      displayEmail: true,
      phone: true,
      website: true,
      socials: true,
      schedule: true,
      fieldOfExpertise: true,
    }
  });
  return { user };
}

async function getPosts(userId: string) {
  const posts = await prisma.posts.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      photos: true,
      author: true,
      authorId: true,
    },
  });
  return { posts };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/login");
  }

  const { user } = await getData(session.user.id);
  const { posts } = await getPosts(session.user.id);

  const safeUser = user
    ? { ...user, schedule: Array.isArray(user.schedule) ? user.schedule as Schedule[] : [] }
    : null;

  const safePosts = posts
    ? posts.map((post) => ({
      ...post,
      author: {
        ...post.author,
        schedule: Array.isArray(post.author.schedule) ? post.author.schedule as Schedule[] : [],
      },
    }))
    : null;

  return (
    <main className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-x-none">

      <h1 className="mx-3 text-4xl font-extrabold  text-primary mb-6">Welcome, {user?.name || "User"}!</h1>

      <div className="flex gap-4 mb-8">
        <GoToButton src="/dashboard/create-news" name="Create News" className="btn btn-primary shadow" />
        <GoToButton src="/dashboard/edit-profile" name="Edit Profile" className="btn btn-primary shadow" />
      </div>

      {safeUser && <ProfileFull user={safeUser} />}

      <div className="w-full mx-auto border border-primary h-0"></div>

      <section className="flex flex-col w-full rounded-2xl shadow-md">
        <div className="font-semibold text-primary text-2xl text-center">My Posts</div>
        {safePosts && <ShortPosts posts={safePosts} session={session} />}
      </section>

      <CreateNewAccount session={session} />
    </main >
  );
}
