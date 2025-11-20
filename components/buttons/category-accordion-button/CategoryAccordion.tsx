'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Triangle } from "lucide-react";

import { CategoryNodeSH, ProfileType } from "@/utils/types";

import ProfileShort from "@/components/profile/profile-short/ProfileShort";
import AddCategoryModal from "@/components/modals/AddCategoryModal";
import AddUserModal from "@/components/modals/AddUserModal";
import EditCategoryModal from "@/components/modals/EditCategoryModal";

export default function CategoryAccordion({
  node,
  level = 0,
  parentKey = "",
  parentPath = [],
  type,
  isAdmin = false,
  pathToCategoryId = {},
}: {
  node: CategoryNodeSH;
  level?: number;
  parentKey?: string;
  parentPath?: string[];
  type: ProfileType;
  isAdmin?: boolean;
  pathToCategoryId?: Record<string, string>;
}) {
  const router = useRouter();
  const collator = useMemo(() => new Intl.Collator('de', { sensitivity: 'base', ignorePunctuation: true }), []);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [showAddRootModal, setShowAddRootModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [activeParentId, setActiveParentId] = useState<string>('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameInitial, setRenameInitial] = useState('');
  const [renameCategoryId, setRenameCategoryId] = useState<string>('');

  const toggle = (cat: string) => {
    setOpen((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleAddRootCategory = async (name: string) => {
    try {
      const response = await fetch('/api/category/create-root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    }
  };

  const handleAddSubcategory = async (name: string) => {
    try {
      const response = await fetch('/api/category/create-subcategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: activeParentId, name }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to create subcategory');
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
      alert('Failed to create subcategory');
    }
  };

  const handleAddUser = async (userId: string) => {
    try {
      const response = await fetch('/api/category/add-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: activeParentId, userId }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to add user to category');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user to category');
    }
  };

  const handleRenameCategory = async (name: string) => {
    try {
      const response = await fetch('/api/category/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: renameCategoryId, name }),
      });
      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to rename category');
      }
    } catch (error) {
      console.error('Error renaming category:', error);
      alert('Failed to rename category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!categoryId) return alert('Missing category id');
    if (!confirm('Delete this category and all subcategories? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/category/delete-tree?id=${categoryId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to delete category');
    }
  };

  const handleRemoveUserFromCategory = async (categoryId: string, userId: string) => {
    if (!confirm('Remove this user from the category?')) return;
    try {
      const res = await fetch(`/api/category/remove-profile?categoryId=${categoryId}&userId=${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to remove user');
    }
  };

  const childEntries = useMemo(
    () =>
      Array.from(node.children.entries()).sort((a, b) =>
        collator.compare(a[0].trim(), b[0].trim())
      ),
    [node, collator]
  );

  const sortedUsers = useMemo(
    () =>
      [...node.users].sort((a, b) =>
        collator.compare((a.name || "").trim(), (b.name || "").trim())
      ),
    [node.users, collator]
  );

  return (
    <>
      {isAdmin && level === 0 && (
        <button
          type="button"
          className="flex items-center gap-2 p-4 font-bold text-xl border border-gray-400 rounded-2xl shadow-xl transition-all cursor-pointer bg-base-100 my-2 w-full text-left"
          onClick={() => setShowAddRootModal(true)}
        >
          Add new category
        </button>
      )}

      {childEntries.map(([catName, child]) => {
        const key = parentKey + catName;
        const isOpen = !!open[key];
        const currentPath = [...parentPath, catName];
        const currentPathLabel = currentPath.join(' > ');
        const currentCategoryId = pathToCategoryId[currentPathLabel];

        // Different styles based on level
        const levelColors = [
          'bg-primary/10 border-primary border-2',      // Level 0 - Primary with strong border
          'bg-secondary border-primary border-2',  // Level 1 - Secondary
          'bg-accent/10 border-accent border-2',        // Level 2 - Accent
          'bg-info/10 border-info border-2',            // Level 3 - Info
        ];
        const categoryStyle = levelColors[Math.min(level, levelColors.length - 1)];

        const countSubcategories = (node: CategoryNodeSH): number => {
          let count = node.children.size;
          node.children.forEach((childNode) => {
            count += countSubcategories(childNode);
          });
          return count;
        };
        const subcategoryCount = countSubcategories(child);

        return (
          <div key={key} className="w-full mb-3">
            <button
              type="button"
              className={`flex items-center gap-3 p-4 font-bold text-lg rounded-xl shadow-md transition-all cursor-pointer w-full text-left hover:shadow-lg ${categoryStyle}`}
              onClick={() => toggle(key)}
              aria-expanded={isOpen}
            >
              <Triangle
                className={`transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : "rotate-90"} text-primary stroke-[3] fill-primary`}
                size={20}
              />
              <div className="flex-1">
                <span>{catName}</span>
                {level > 0 && (
                  <div className="text-xs text-gray-500 font-normal mt-1">
                    {currentPathLabel}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {subcategoryCount > 0 && (
                  <span className="badge badge-primary">
                    {subcategoryCount} {subcategoryCount === 1 ? 'Kategorie' : 'Kategorien'}
                  </span>
                )}

                {child.users.length > 0 && (
                  <span className="badge badge-primary">
                    {child.users.length} {child.users.length === 1 ? 'Profil' : 'Profile'}
                  </span>
                )}
              </div>
            </button>

            {isOpen && (
              <div className={`mt-2 pl-4 border-l-4 ${level === 0 ? 'border-primary' : level === 1 ? 'border-accent' : level === 2 ? 'border-secondary' : 'border-info'}`}>
                {child.users.length > 0 && (
                  <div className="space-y-2 mb-3 mt-2">
                    {child.users
                      .slice()
                      .sort((a, b) => collator.compare((a.name || '').trim(), (b.name || '').trim()))
                      .map((user) => {
                        const { id, name, bio, profileImages } = user;
                        if (!bio || !name || !id) return null;
                        return (
                          <div key={id} className="relative">
                            <ProfileShort
                              id={id}
                              name={name}
                              bio={bio}
                              image={profileImages?.[0] ?? null}
                            />
                            {isAdmin && (
                              <div className="mt-1 ml-2">
                                <button
                                  type="button"
                                  className="btn btn-xs btn-outline btn-error"
                                  onClick={() => {
                                    if (!currentCategoryId) return alert('Missing category id for this path');
                                    handleRemoveUserFromCategory(currentCategoryId, id);
                                  }}
                                >
                                  Remove from category
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                  </div>
                )}

                {isAdmin && (
                  <div className="flex flex-wrap justify-between items-center gap-2 my-3 p-3 bg-primary/40 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary border-black/60"
                        onClick={() => {
                          if (!currentCategoryId) return alert('Missing category id for this path');
                          setActiveParentId(currentCategoryId);
                          setShowAddSubModal(true);
                        }}
                      >
                        Add Subcategory
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary border-black/60"
                        onClick={() => {
                          if (!currentCategoryId) return alert('Missing category id for this path');
                          setActiveParentId(currentCategoryId);
                          setShowAddUserModal(true);
                        }}
                      >
                        Add User To Category
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning text-white border-black/60"
                        onClick={() => {
                          if (!currentCategoryId) return alert('Missing category id for this path');
                          setRenameCategoryId(currentCategoryId);
                          setRenameInitial(catName);
                          setShowRenameModal(true);
                        }}
                      >
                        Rename Category
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-error text-white border-black/60"
                        onClick={() => {
                          if (!currentCategoryId) return alert('Missing category id for this path');
                          handleDeleteCategory(currentCategoryId);
                        }}
                      >
                        Delete Category
                      </button>
                    </div>
                  </div>
                )}

                <CategoryAccordion
                  node={child}
                  level={level + 1}
                  parentKey={key + "-"}
                  parentPath={currentPath}
                  type={type}
                  isAdmin={isAdmin}
                  pathToCategoryId={pathToCategoryId}
                />
              </div>
            )}
          </div>
        );
      })}

      {level === 0 &&
        sortedUsers
          .filter((user) => Boolean(user.id && user.name && user.bio))
          .map((user) => (
            <ProfileShort
              key={user.id}
              id={user.id}
              name={user.name}
              bio={user.bio as string}
              image={user.profileImages?.[0] ?? null}
            />
          ))}

      <AddCategoryModal
        isOpen={showAddRootModal}
        onClose={() => setShowAddRootModal(false)}
        onSubmit={handleAddRootCategory}
        title="Add New Root Category"
      />

      <AddCategoryModal
        isOpen={showAddSubModal}
        onClose={() => setShowAddSubModal(false)}
        onSubmit={handleAddSubcategory}
        title="Add New Subcategory"
      />

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
      />

      <EditCategoryModal
        isOpen={showRenameModal}
        initialName={renameInitial}
        onClose={() => setShowRenameModal(false)}
        onSubmit={handleRenameCategory}
        title="Rename Category"
      />
    </>
  );
}