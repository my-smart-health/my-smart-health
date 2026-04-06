'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Triangle } from "lucide-react";
import { useTranslations } from "next-intl";

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
  locale = 'de',
  categoryTranslations = {},
}: {
  node: CategoryNodeSH;
  level?: number;
  parentKey?: string;
  parentPath?: string[];
  type: ProfileType;
  isAdmin?: boolean;
  pathToCategoryId?: Record<string, string>;
  locale?: string;
  categoryTranslations?: Record<string, { name: string; nameEn?: string }>;
}) {
  const t = useTranslations('CategoryAccordion');
  const router = useRouter();
  const collator = useMemo(() => new Intl.Collator('de', { sensitivity: 'base', ignorePunctuation: true }), []);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [showAddRootModal, setShowAddRootModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [activeParentId, setActiveParentId] = useState<string>('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameInitial, setRenameInitial] = useState('');
  const [renameInitialEn, setRenameInitialEn] = useState('');
  const [renameCategoryId, setRenameCategoryId] = useState<string>('');

  const toggle = (cat: string) => {
    setOpen((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleAddRootCategory = async (name: string, nameEn?: string) => {
    try {
      const response = await fetch('/api/category/create-root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nameEn, type }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert(t('createCategoryFailed'));
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert(t('createCategoryFailed'));
    }
  };

  const handleAddSubcategory = async (name: string, nameEn?: string) => {
    try {
      const response = await fetch('/api/category/create-subcategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId: activeParentId, name, nameEn }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert(t('createSubcategoryFailed'));
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
      alert(t('createSubcategoryFailed'));
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
        alert(t('addUserFailed'));
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert(t('addUserFailed'));
    }
  };

  const handleRenameCategory = async (name: string, nameEn?: string) => {
    try {
      const response = await fetch('/api/category/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: renameCategoryId, name, nameEn }),
      });
      if (response.ok) {
        router.refresh();
      } else {
        alert(t('renameCategoryFailed'));
      }
    } catch (error) {
      console.error('Error renaming category:', error);
      alert(t('renameCategoryFailed'));
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!categoryId) return alert(t('missingCategoryId'));
    if (!confirm(t('confirmDeleteCategoryTree'))) return;
    try {
      const res = await fetch(`/api/category/delete-tree?id=${categoryId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      router.refresh();
    } catch (e) {
      console.error(e);
      alert(t('deleteCategoryFailed'));
    }
  };

  const handleRemoveUserFromCategory = async (categoryId: string, userId: string) => {
    if (!confirm(t('confirmRemoveUser'))) return;
    try {
      const res = await fetch(`/api/category/remove-profile?categoryId=${categoryId}&userId=${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      router.refresh();
    } catch (e) {
      console.error(e);
      alert(t('removeUserFailed'));
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
          {t('addNewCategory')}
        </button>
      )}

      {childEntries.map(([catName, child]) => {
        const key = parentKey + catName;
        const isOpen = !!open[key];
        const currentPath = [...parentPath, catName];
        const currentPathLabel = currentPath.join(' > ');
        const currentCategoryId = pathToCategoryId[currentPathLabel];
        const translations = currentCategoryId ? categoryTranslations[currentCategoryId] : undefined;
        const displayName = locale !== 'de' && translations?.nameEn ? translations.nameEn : catName;

        // Different styles based on level
        const levelColors = [
          'bg-primary/10 border-primary border-2',      // Level 0 - Primary with strong border
          'bg-secondary border-primary border-2',  // Level 1 - Secondary
          'bg-accent/10 border-accent border-2',        // Level 2 - Accent
          'bg-info/10 border-info border-2',            // Level 3 - Info
        ];
        const categoryStyle = levelColors[Math.min(level, levelColors.length - 1)];

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
                <span>{displayName}</span>
              </div>
            </button>

            {isOpen && (
              <div className={`mt-2 pl-4 border-l-4 ${level === 0 ? 'border-primary' : level === 1 ? 'border-accent' : level === 2 ? 'border-secondary' : 'border-info'}`}>
                {child.users.length > 0 && (
                  <div className="space-y-2 mb-3 mt-2">
                    {Array.from(new Map(child.users.map((u) => [u.id, u])).values())
                      .slice()
                      .sort((a, b) => collator.compare((a.name || '').trim(), (b.name || '').trim()))
                      .map((user) => {
                        const { id, name, bio, profileImages, membership, ratingStars } = user;
                        if (!bio || !name || !id) return null;
                        return (
                          <div key={id} className="relative">
                            <ProfileShort
                              id={id}
                              name={name}
                              bio={bio}
                              image={profileImages?.[0] ?? null}
                              membership={membership ?? null}
                              ratingStars={ratingStars ?? null}
                              ratingLink={user.ratingLink ?? null}
                            />
                            {isAdmin && (
                              <div className="mt-1 ml-2">
                                <button
                                  type="button"
                                  className="btn btn-xs btn-outline btn-error"
                                  onClick={() => {
                                    if (!currentCategoryId) return alert(t('missingCategoryId'));
                                    handleRemoveUserFromCategory(currentCategoryId, id);
                                  }}
                                >
                                  {t('removeFromCategory')}
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
                          if (!currentCategoryId) return alert(t('missingCategoryId'));
                          setActiveParentId(currentCategoryId);
                          setShowAddSubModal(true);
                        }}
                      >
                        {t('addSubcategory')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary border-black/60"
                        onClick={() => {
                          if (!currentCategoryId) return alert(t('missingCategoryId'));
                          setActiveParentId(currentCategoryId);
                          setShowAddUserModal(true);
                        }}
                      >
                        {t('addUserToCategory')}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning text-white border-black/60"
                        onClick={() => {
                          if (!currentCategoryId) return alert(t('missingCategoryId'));
                          setRenameCategoryId(currentCategoryId);
                          setRenameInitial(catName);
                          setRenameInitialEn(translations?.nameEn ?? '');
                          setShowRenameModal(true);
                        }}
                      >
                        {t('renameCategory')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-error text-white border-black/60"
                        onClick={() => {
                          if (!currentCategoryId) return alert(t('missingCategoryId'));
                          handleDeleteCategory(currentCategoryId);
                        }}
                      >
                        {t('deleteCategory')}
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
                  locale={locale}
                  categoryTranslations={categoryTranslations}
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
              membership={user.membership ?? null}
            />
          ))}

      <AddCategoryModal
        isOpen={showAddRootModal}
        onClose={() => setShowAddRootModal(false)}
        onSubmit={handleAddRootCategory}
        title={t('modalAddRootTitle')}
      />

      <AddCategoryModal
        isOpen={showAddSubModal}
        onClose={() => setShowAddSubModal(false)}
        onSubmit={handleAddSubcategory}
        title={t('modalAddSubTitle')}
      />

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
      />

      <EditCategoryModal
        isOpen={showRenameModal}
        initialName={renameInitial}
        initialNameEn={renameInitialEn}
        onClose={() => setShowRenameModal(false)}
        onSubmit={handleRenameCategory}
        title={t('modalRenameTitle')}
      />
    </>
  );
}