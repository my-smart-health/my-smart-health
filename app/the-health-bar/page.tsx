import prisma from "@/lib/db";
import { normalizeUser } from "@/utils/normalize";
import ProfileFull from "@/components/profile/profile-full/ProfileFull";
import GoToButton from "@/components/buttons/go-to/GoToButton";
import { auth } from "@/auth";
import CategoryIndex from "@/components/pages/CategoryIndex";
import { PROFILE_TYPE_THE_HEALTH_BAR, CACHE_STRATEGY } from "@/utils/constants";

async function getTheHealthBarProfile(isAdmin: boolean) {
  const cacheStrategy = isAdmin ? CACHE_STRATEGY.NONE : CACHE_STRATEGY.MEDIUM_LONG;

  const theHealthBar = await prisma.user.findUnique({
    where: { email: 'health@future-health.de' },
    include: {
      locations: true,
      certificates: true,
    },
    cacheStrategy,
  });

  return normalizeUser(theHealthBar);
}

async function getTheHealthBarPosts(isAdmin: boolean) {
  const cacheStrategy = isAdmin ? CACHE_STRATEGY.NONE : CACHE_STRATEGY.MEDIUM;

  const posts = await prisma.posts.findMany({
    where: { author: { email: 'health@future-health.de' } },
    cacheStrategy,
  });

  return posts;
}

export default async function TheHealthBarPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  const theHealthBar = await getTheHealthBarProfile(isAdmin);
  const posts = await getTheHealthBarPosts(isAdmin);
  return (
    <>
      {session?.user.role === "ADMIN" && (
        <GoToButton
          name="Edit The Health Bar"
          src={`/dashboard/edit-profile/${theHealthBar.id}`}
          className="btn btn-warning rounded text-white mb-2"
        />
      )}
      <ProfileFull user={theHealthBar} posts={posts} />
      <div className="w-full">
        <CategoryIndex profileType={PROFILE_TYPE_THE_HEALTH_BAR} />
      </div>
    </>
  );
}
