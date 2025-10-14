import prisma from "@/lib/db";
import { auth } from "@/auth";

import CategoryAccordion from "@/components/buttons/category-accordion-button/CategoryAccordion";

import { PROFILE_TYPE_MEDIZIN_UND_PFLEGE } from "@/utils/constants";
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
  const cats = await prisma.category.findMany({ where: { type: PROFILE_TYPE_MEDIZIN_UND_PFLEGE }, select: { id: true }, orderBy: { name: 'asc' } });
  const catIds = cats.map(c => c.id);

  if (catIds.length === 0) return [];

  const links = await prisma.categoryUser.findMany({ where: { categoryId: { in: catIds } }, orderBy: { order: 'asc' }, select: { categoryId: true, user: { select: { id: true, name: true, bio: true, profileImages: true } } } });

  async function buildPath(categoryId: string) {
    const path: string[] = [];
    let currentId: string | null = categoryId;
    while (currentId) {
      const c: { name: string | null; parentId: string | null } | null = await prisma.category.findUnique({ where: { id: currentId }, select: { name: true, parentId: true } });
      if (!c) break;
      path.unshift(c.name as string);
      currentId = (c.parentId as string) ?? null;
    }
    return path;
  }

  const results: UserProfileSH[] = [];
  for (const link of links) {
    const user = link.user;
    if (!user || !Array.isArray(user.profileImages) || user.profileImages.length === 0) continue;
    const path = await buildPath(link.categoryId);
    if (!path.length) continue;
    results.push({
      id: user.id,
      name: user.name || 'No Name',
      bio: user.bio || '',
      category: path,
      profileImages: user.profileImages,
    });
  }

  return results;
}

export default async function SmartHealthPage() {
  const users = await getSmartHealthUsers();
  const tree = buildCategoryTree(users);

  const allCats = await prisma.category.findMany({ where: { type: PROFILE_TYPE_MEDIZIN_UND_PFLEGE }, select: { id: true, name: true, parentId: true } });
  const byId = new Map(allCats.map(c => [c.id, c] as const));
  const pathToCategoryId: Record<string, string> = {};
  for (const c of allCats) {
    const path: string[] = [];
    let current: string | null = c.id;
    while (current) {
      const cur = byId.get(current);
      if (!cur) break;
      path.unshift(cur.name);
      current = cur.parentId as string | null;
    }
    if (path.length) pathToCategoryId[path.join(' > ')] = c.id;
  }

  const ensurePath = (node: CategoryNodeSH, path: string[]) => {
    let n = node;
    for (const seg of path) {
      if (!n.children.has(seg)) {
        n.children.set(seg, { name: seg, children: new Map(), users: [] });
      }
      n = n.children.get(seg)!;
    }
  };

  for (const c of allCats) {
    const path: string[] = [];
    let current: string | null = c.id;
    while (current) {
      const cur = byId.get(current);
      if (!cur) break;
      path.unshift(cur.name);
      current = cur.parentId as string | null;
    }
    if (path.length) ensurePath(tree, path);
  }

  const sortTree = (node: CategoryNodeSH) => {
    const entries = Array.from(node.children.entries()).sort((a, b) => a[0].localeCompare(b[0], 'de', { sensitivity: 'base' }));
    node.children = new Map(entries);
    for (const [, child] of node.children) sortTree(child);
  };

  sortTree(tree);

  const session = await auth();

  return (
    <div className="grid grid-cols-1 gap-2">
      <CategoryAccordion node={tree} type={PROFILE_TYPE_MEDIZIN_UND_PFLEGE} isAdmin={session?.user?.role === "ADMIN"} pathToCategoryId={pathToCategoryId} />
    </div>
  );
}
