import prisma from "@/lib/db";

import CategoryAccordion from "./CategoryAccordion";

import { PROFILE_TYPE_SMART_HEALTH } from "@/utils/constants";
import { CategoryNodeSH, UserProfileSH } from "@/utils/types";


function buildCategoryTree(users: UserProfileSH[]): CategoryNodeSH {
  const root: CategoryNodeSH = { name: "", children: new Map(), users: [] };
  for (const user of users) {
    let node = root;
    const cleanCategories = (user.category || []).map(c => c.trim()).filter(Boolean);
    for (let i = 0; i < cleanCategories.length; i++) {
      const cat = cleanCategories[i];
      if (!node.children.has(cat)) {
        node.children.set(cat, { name: cat, children: new Map(), users: [] });
      }
      node = node.children.get(cat)!;
      if (i === cleanCategories.length - 1) {
        node.users.push(user);
      }
    }
  }
  return root;
}

async function getSmartHealthUsers(): Promise<UserProfileSH[]> {
  const users = await prisma.user.findMany({
    where: { profileType: PROFILE_TYPE_SMART_HEALTH },
    select: {
      id: true,
      name: true,
      bio: true,
      category: true,
      profileImages: true,
    }
  });

  return users
    .filter(
      u =>
        Array.isArray(u.category) &&
        u.category.length > 0 &&
        Array.isArray(u.profileImages) &&
        u.profileImages.length > 0
    )
    .map(u => ({
      id: u.id,
      name: u.name || "No Name",
      bio: u.bio || "",
      category: (u.category as string[]).map(c => c.trim()).filter(Boolean),
      profileImages: u.profileImages as string[],
    }));
}

export default async function SmartHealthPage() {
  const users = await getSmartHealthUsers();
  const tree = buildCategoryTree(users);

  return (
    <div className="grid grid-cols-1 gap-2">
      <CategoryAccordion node={tree} />
    </div>
  );
}
