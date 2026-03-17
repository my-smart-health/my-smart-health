"use client";

import { Trash2, UserSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDeletionProgress } from "@/components/modals/deletion-progress";

type User = {
  id: string;
  name: string | null;
  email: string;
  category: string[];
  createdAt: Date;
  role: string;
  profileImages?: string[];
  isContactable: boolean;
};

type SortKey = keyof Pick<User, "name" | "email" | "category" | "role" | "createdAt" | "isContactable">;

export default function UserTable({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [allUsers, setAllUsers] = useState(users);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    setAllUsers(users);
  }, [users]);

  const { startDeletion, updateMessage, finishDeletion } = useDeletionProgress();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedUsers = [...allUsers].sort((a, b) => {
    let aValue: string = "";
    let bValue: string = "";

    if (sortKey === "category") {
      aValue = (a.category || []).join(" > ");
      bValue = (b.category || []).join(" > ");
    } else {
      aValue = (a[sortKey] || "") as string;
      bValue = (b[sortKey] || "") as string;
    }

    if (aValue < bValue) return sortAsc ? -1 : 1;
    if (aValue > bValue) return sortAsc ? 1 : -1;
    return 0;
  });

  const sortArrow = (key: SortKey) =>
    sortKey === key ? (sortAsc ? "▲" : "▼") : "";

  const handleChangeContactable = async (userId: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/change-contactable`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isContactable: !currentValue }),
      });
      if (!response.ok) throw new Error("Failed to update contactable status");

      setAllUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isContactable: !currentValue } : user
        )
      );
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error updating contactable status:", error);
      }
    }
  };

  const handleDeleteUser = async (id: string, userName: string) => {
    if (id === currentUserId) return;
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeletingUserId(id);
    startDeletion(userName || 'Unbekannter Benutzer');

    try {
      updateMessage('Benutzerdaten werden gelöscht...');
      const res = await fetch(`/api/delete/delete-user?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");

      updateMessage('Benutzer erfolgreich gelöscht!');
      setAllUsers((prev) => prev.filter(user => user.id !== id));

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error deleting user:", error);
      }
      updateMessage('Fehler beim Löschen des Benutzers');
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      finishDeletion();
      setDeletingUserId(null);
    }
  };

  const ToggleContactable = ({ user }: { user: User }) => {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={user.isContactable}
          onChange={() => handleChangeContactable(user.id, user.isContactable)}
          className={`px-2 py-1 rounded-md text-sm font-semibold ${user.isContactable ? 'checkbox checkbox-primary text-green-800' : 'checkbox checkbox-primary text-gray-600'}`}
        />
        {user.isContactable ? 'Yes' : 'No'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("name")}
            >
              Name {sortArrow("name")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("email")}
            >
              Email {sortArrow("email")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("category")}
            >
              Category {sortArrow("category")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("createdAt")}>
              Created at {sortArrow("createdAt")}
            </th>
            <th>Profile Image</th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("isContactable")}
            >
              Contactable {sortArrow("isContactable")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("role")}
            >
              Role {sortArrow("role")}
            </th>
            <th>View</th>
            <th>Edit User</th>
            <th className="text-red-500">Delete User</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, idx) => {
            const createdAtFormatted = new Date(user.createdAt).toLocaleDateString('de-DE');
            return (
              <tr key={user.id || idx} className="hover:bg-primary/50 bg-primary/30">
                <td className="font-semibold">{user.name || "No Name"}</td>
                <td>{user.email}</td>
                <td className="min-w-[200px] max-w-sm">
                  {Array.isArray(user.category) && user.category.length > 0 ? (
                    <div className="space-y-1">
                      {user.category.map((categoryPath, idx) => (
                        <div
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm border"
                        >
                          {categoryPath}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No categories assigned</span>
                  )}
                </td>
                <td>{createdAtFormatted}</td>
                <td>
                  {user.profileImages?.[0] ? (
                    <Image
                      src={user.profileImages[0]}
                      alt={user.name || "Profile Image"}
                      width={100}
                      height={100}
                      style={{ objectFit: "contain" }}
                      className="rounded aspect-square border border-primary hover:scale-200 transition-transform duration-200"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td><ToggleContactable user={user} /></td>
                <td className="uppercase font-bold">{user.role}</td>
                <td>
                  <Link
                    href={`/profile/${user.id}`}
                    className="font-semibold text-blue-500 hover:underline flex flex-col justify-center items-center gap-1"
                  >
                    <UserSearch className="inline-block mr-1" /> View
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/dashboard/edit-profile/${user.id}`}
                    className="font-semibold text-yellow-500 hover:underline flex flex-col justify-center items-center gap-1"
                  >
                    <UserSearch className="inline-block mr-1" /> Edit User
                  </Link>
                </td>
                <td>
                  {user.id === currentUserId && (
                    <div className="text-xs text-gray-500 text-center mb-1">Current user</div>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                    disabled={user.id === currentUserId || deletingUserId === user.id}
                    className="font-semibold text-red-500 hover:underline flex flex-col justify-center items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="inline-block mb-1" /> {deletingUserId === user.id ? "Deleting..." : "Delete User"}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}