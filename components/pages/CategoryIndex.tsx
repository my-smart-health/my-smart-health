import prisma from '@/lib/db';
import CategoryAccordion from '@/components/buttons/category-accordion-button/CategoryAccordion';
import { auth } from '@/auth';
import { CategoryNodeSH, Membership, UserProfileSH, ProfileType } from '@/utils/types';

type Props = {
  profileType: ProfileType;
};

type CategoryRecord = {
  id: string;
  name: string;
  parentId: string | null;
};

type CategoryLookup = Map<string, CategoryRecord>;

type LoadResult = {
  tree: CategoryNodeSH;
  pathToCategoryId: Record<string, string>;
};

function buildCategoryTree(users: UserProfileSH[]): CategoryNodeSH {
  const root: CategoryNodeSH = { name: '', children: new Map(), users: [] };
  const collator = new Intl.Collator('de', { sensitivity: 'base', ignorePunctuation: true });
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
        node.users.push({
          ...user,
          name: user.name ? user.name.trim() : user.name,
        });
        node.users.sort((a, b) => collator.compare((a.name || '').trim(), (b.name || '').trim()));
      }
    }
  }
  return root;
}

const resolveCategoryPath = (
  categoryId: string,
  lookup: CategoryLookup,
  cache: Map<string, string[]>,
): string[] => {
  if (cache.has(categoryId)) return cache.get(categoryId)!;

  const visited = new Set<string>();
  const path: string[] = [];
  let current: string | null = categoryId;

  while (current) {
    if (visited.has(current)) break;
    visited.add(current);
    const record = lookup.get(current);
    if (!record) break;
    path.unshift(record.name);
    current = record.parentId;
  }

  cache.set(categoryId, path);
  return path;
};

async function loadCategoryTree(profileType: ProfileType): Promise<LoadResult> {
  const collator = new Intl.Collator('de', { sensitivity: 'base', ignorePunctuation: true });
  const categories = await prisma.category.findMany({
    where: { type: profileType },
    select: { id: true, name: true, parentId: true },
  });

  if (!categories.length) {
    return { tree: buildCategoryTree([]), pathToCategoryId: {} };
  }

  const lookup: CategoryLookup = new Map(categories.map(category => [category.id, category]));
  const pathCache = new Map<string, string[]>();

  const links = await prisma.categoryUser.findMany({
    where: { categoryId: { in: Array.from(lookup.keys()) } },
    select: {
      categoryId: true,
      user: { select: { id: true, name: true, bio: true, profileImages: true, membership: true } },
    },
  });

  const users: UserProfileSH[] = [];
  for (const link of links) {
    const user = link.user;
    if (!user) continue;
    const path = resolveCategoryPath(link.categoryId, lookup, pathCache);
    if (!path.length) continue;

    users.push({
      id: user.id,
      name: user.name || 'No Name',
      bio: user.bio || '',
      category: path,
      profileImages: Array.isArray(user.profileImages) ? user.profileImages : [],
      membership: user.membership && typeof user.membership === 'object' && 'status' in user.membership && 'link' in user.membership
        ? user.membership as Membership
        : null,
    });
  }

  const tree = buildCategoryTree(users);

  const ensurePath = (node: CategoryNodeSH, path: string[]) => {
    let cursor = node;
    for (const segment of path) {
      if (!cursor.children.has(segment)) {
        cursor.children.set(segment, { name: segment, children: new Map(), users: [] });
      }
      cursor = cursor.children.get(segment)!;
    }
  };

  for (const category of categories) {
    const path = resolveCategoryPath(category.id, lookup, pathCache);
    if (path.length) ensurePath(tree, path);
  }

  const pathToCategoryId: Record<string, string> = {};
  for (const category of categories) {
    const path = resolveCategoryPath(category.id, lookup, pathCache);
    if (path.length) {
      pathToCategoryId[path.join(' > ')] = category.id;
    }
  }

  const sortTree = (node: CategoryNodeSH) => {
    // Sort categories alphabetically
    const sorted = Array.from(node.children.entries()).sort((a, b) =>
      collator.compare(a[0].trim(), b[0].trim()),
    );
    node.children = new Map(sorted);

    // Sort users alphabetically by name
    if (node.users.length > 0) {
      node.users.sort((a, b) =>
        collator.compare((a.name || '').trim(), (b.name || '').trim())
      );
    }

    // Recursively sort child nodes
    for (const [, child] of node.children) sortTree(child);
  };

  sortTree(tree);

  return { tree, pathToCategoryId };
}

export default async function CategoryIndex({ profileType }: Props) {
  const [categoryData, session] = await Promise.all([loadCategoryTree(profileType), auth()]);

  return (
    <div className="grid grid-cols-1 gap-2">
      <CategoryAccordion
        node={categoryData.tree}
        type={profileType}
        isAdmin={session?.user?.role === 'ADMIN'}
        pathToCategoryId={categoryData.pathToCategoryId}
      />
    </div>
  );
}
