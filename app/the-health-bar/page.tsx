import prisma from "@/lib/db";
import { normalizeUser } from "@/utils/normalize";
import ProfileFull from "@/components/profile/profile-full/ProfileFull";

async function getTheHealthBarProfile() {
  const theHealthBar = await prisma.user.findUnique({
    where: { email: 'healthbar@healthbar.de' },
    include: {
      locations: true,
      certificates: true,
    },
  });

  return normalizeUser(theHealthBar);
}

async function getTheHealthBarPosts() {
  const posts = await prisma.posts.findMany({
    where: { author: { email: 'healthbar@healthbar.de' } },
  });

  return posts;
}

export default async function TheHealthBarPage() {
  const theHealthBar = await getTheHealthBarProfile();
  const posts = await getTheHealthBarPosts();
  return <ProfileFull user={theHealthBar} posts={posts} />;
}
