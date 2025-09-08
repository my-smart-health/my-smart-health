import { auth } from "@/auth";
import GoBack from "@/components/buttons/go-back/GoBack";
import ShortPosts from "@/components/posts/short-posts/ShortPosts";
import ProfileFull from "@/components/profile-full/ProfileFull";
import prisma from "@/lib/db";
import { Schedule } from "@/utils/types";
import Link from "next/link";

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
    },
  });
  return { user };
}

async function getPosts(userId: string) {
  const posts = await prisma.posts.findMany({
    where: { authorId: userId },
  });
  return { posts };
}

function UserNotFound() {
  return (
    <>
      <main
        className="flex flex-col items-center justify-center gap-3 w-full mb-auto max-w-[100%]">
        <div>User not found</div>
        <GoBack />
      </main>
    </>
  );
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  const safeSession = session ? session : null;

  const { id } = await params;
  const { user } = await getUser(id);
  const { posts } = await getPosts(id);
  if (!user || user === null) {
    return (
      <UserNotFound />
    );
  }
  const safeSchedule = user.schedule ? user.schedule as Schedule[] : [];
  const safeUser = { ...user, schedule: safeSchedule };

  return (
    <>
      <main
        className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-none">
        <ProfileFull user={safeUser} />
        <span className="self-end pr-2">
          <GoBack />
        </span>
        <section className="flex flex-col w-full rounded-2xl shadow-md">
          <div className="font-semibold text-primary text-2xl text-center">Posts</div>
          {posts ? <ShortPosts posts={posts} session={safeSession} /> : <div>No posts available</div>}
        </section>
        {session?.user?.role === "ADMIN" && (
          <div
            className="text-sm text-gray-500 italic mt-4">
            <Link
              href={`/dashboard/edit-profile/${user.id}`}
              className="btn btn-warning underline">
              Edit profile
            </Link>
            <p className="mt-2">
              Note: You are logged in as an admin. You can edit any user&apos;s profile from the admin dashboard.
            </p>
          </div>
        )}
      </main>
    </>
  );
}