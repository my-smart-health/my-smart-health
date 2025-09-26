"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type User = {
  id: string;
  name: string | null;
  email: string;
  category: string[];
  role: string;
  profileImages?: string[];
};

type SortKey = keyof Pick<User, "name" | "email"> | "category" | "role";

export default function UserTable({ users }: { users: User[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
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
            <th>Profile Image</th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("role")}
            >
              Role {sortArrow("role")}
            </th>
            <th>View</th>
            <th>Edit Category</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, idx) => (
            <tr key={user.id || idx} className="hover:bg-primary/50 bg-primary/30">
              <td className="font-semibold">{user.name || "No Name"}</td>
              <td>{user.email}</td>
              <td>
                {Array.isArray(user.category)
                  ? user.category.join(" > ")
                  : user.category}
              </td>
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
              <td className="uppercase font-bold">{user.role}</td>
              <td>
                <Link
                  href={`/profile/${user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View
                </Link>
              </td>
              <td>
                <Link
                  href={`/dashboard/edit-user-category/${user.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}