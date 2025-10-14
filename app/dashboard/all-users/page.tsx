import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserTable from "@/components/user/UserTable";

async function getAllUsersWithCategories() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      profileImages: true
    }
  });

  const links = await prisma.categoryUser.findMany({
    where: { userId: { in: users.map(u => u.id) } },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          parentId: true
        }
      }
    },
    orderBy: { order: 'asc' }
  });

  const allCategories = await prisma.category.findMany({
    select: { id: true, name: true, parentId: true }
  });

  const categoryMap = new Map(allCategories.map(c => [c.id, c]));

  const buildCategoryPath = (categoryId: string): string => {
    const path: string[] = [];
    let current = categoryMap.get(categoryId);

    while (current) {
      path.unshift(current.name);
      current = current.parentId ? categoryMap.get(current.parentId) : undefined;
    }

    return path.join(' > ');
  };

  const userCategoryMap = new Map<string, string[]>();
  for (const link of links) {
    const userId = link.userId;
    const categoryPath = buildCategoryPath(link.category.id);

    if (!userCategoryMap.has(userId)) {
      userCategoryMap.set(userId, []);
    }
    userCategoryMap.get(userId)!.push(categoryPath);
  }

  return users.map(u => ({
    ...u,
    category: userCategoryMap.get(u.id) || [],
    createdAt: u.createdAt instanceof Date ? u.createdAt.toLocaleString('de-DE') : u.createdAt
  }));
}

export default async function AllUsersPage() {

  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return (redirect("/login"));
  }

  const users = await getAllUsersWithCategories();

  if (!users) {
    return (
      <>
        <div>No users found</div>
      </>
    );
  }

  return (
    <>
      <h1>All Users</h1>
      <UserTable users={users} />
    </>
  );
}
