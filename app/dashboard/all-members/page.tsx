import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CACHE_STRATEGY } from "@/utils/constants";
import SearchFilterMembers from "@/components/search/SearchFilterMembers";


async function getAllMembers() {
  const members = await prisma.memberProfile.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
  });

  return members;
}

export default async function AllMembersPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/login");
  }

  const members = await getAllMembers();

  if (!members || members.length === 0) {
    return (
      <>
        <h1>All Members</h1>
        <div>No members found</div>
      </>
    );
  }

  return (
    <>
      <h1>All Members</h1>
      <SearchFilterMembers members={members} />
    </>
  );
}
