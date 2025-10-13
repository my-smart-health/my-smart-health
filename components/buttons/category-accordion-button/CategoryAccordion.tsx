'use client';

import { useState } from "react";
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

      {[...node.children.entries()].map(([catName, child]) => {
        const key = parentKey + catName;
        const isOpen = !!open[key];
        const currentPath = [...parentPath, catName];
        const currentPathLabel = currentPath.join(' > ');
        const currentCategoryId = pathToCategoryId[currentPathLabel];
        return (
          <div key={key} style={{ paddingLeft: `${level * 1}px` }} className="w-full">
            <button
              type="button"
              className="flex items-center gap-2 p-4 font-bold text-xl border border-gray-400 rounded-2xl shadow-xl transition-all cursor-pointer bg-base-100 my-1 w-full text-left"
              onClick={() => toggle(key)}
              aria-expanded={isOpen}
            >
              <Triangle
                className={`transition-transform ${isOpen ? "rotate-180" : "rotate-90"} text-primary stroke-3 fill-primary`}
              />
              <span>{catName}</span>
            </button>
            {isOpen && (
              <div className="border-l-2 border-gray-300 pl-2">
                {child.users.map((user) => {
                  const { id, name, bio, profileImages } = user;
                  if (!profileImages || profileImages.length === 0 || !bio || !name || !id) return null;
                  return (
                    <div key={id} style={{ marginBottom: '10px' }} className="w-full">
                      <ProfileShort
                        id={id}
                        name={name}
                        bio={bio}
                        image={profileImages[0]}
                      />
                      {isAdmin && (
                        <div className="mt-2">
                          <button
                            type="button"
                            className="btn btn-xs btn-outline"
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
                {isAdmin && (
                  <div className="flex flex-wrap gap-2 my-2">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => {
                        if (!currentCategoryId) return alert('Missing category id for this path');
                        setActiveParentId(currentCategoryId);
                        setShowAddSubModal(true);
                      }}
                    >
                      Add subcategory
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => {
                        if (!currentCategoryId) return alert('Missing category id for this path');
                        setActiveParentId(currentCategoryId);
                        setShowAddUserModal(true);
                      }}
                    >
                      Add user to category
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => {
                        if (!currentCategoryId) return alert('Missing category id for this path');
                        setRenameCategoryId(currentCategoryId);
                        setRenameInitial(catName);
                        setShowRenameModal(true);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        if (!currentCategoryId) return alert('Missing category id for this path');
                        handleDeleteCategory(currentCategoryId);
                      }}
                    >
                      Delete category
                    </button>
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
        node.users.map((user) => (
          <ProfileShort
            key={user.id}
            id={user.id}
            name={user.name}
            bio={user.bio ?? ""}
            image={user.profileImages[0]}
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