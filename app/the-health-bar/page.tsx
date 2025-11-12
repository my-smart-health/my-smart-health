import prisma from "@/lib/db";
import { normalizeUser } from "@/utils/normalize";
import ProfileFull from "@/components/profile/profile-full/ProfileFull";
import GoToButton from "@/components/buttons/go-to/GoToButton";
import { auth } from "@/auth";
import CategoryIndex from "@/components/pages/CategoryIndex";
import { PROFILE_TYPE_THE_HEALTH_BAR } from "@/utils/constants";

async function getTheHealthBarProfile() {
  const theHealthBar = await prisma.user.findUnique({
    where: { email: 'health@future-health.de' },
    include: {
      locations: true,
      certificates: true,
    },
    cacheStrategy: { ttl: 180, swr: 90 },
  });

  return normalizeUser(theHealthBar);
}

async function getTheHealthBarPosts() {
  const posts = await prisma.posts.findMany({
    where: { author: { email: 'health@future-health.de' } },
    cacheStrategy: { ttl: 120, swr: 60 },
  });

  return posts;
}

export default async function TheHealthBarPage() {
  const session = await auth();
  const theHealthBar = await getTheHealthBarProfile();
  const posts = await getTheHealthBarPosts();
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
