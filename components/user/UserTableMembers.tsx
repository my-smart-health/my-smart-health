"use client";

import Link from "next/link";
import { UserSearch, Eye } from "lucide-react";
import { useEffect, useState } from "react";

type Member = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date | string;
  role: string;
};

type SortKey = keyof Pick<Member, "name" | "email" | "role" | "createdAt">;

export default function UserTableMembers({ members }: { members: Member[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [allMembers, setAllMembers] = useState(members);

  useEffect(() => {
    setAllMembers(members);
  }, [members]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedMembers = [...allMembers].sort((a, b) => {
    const aValue = String(a[sortKey] ?? "");
    const bValue = String(b[sortKey] ?? "");

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
              onClick={() => handleSort("createdAt")}>
              Created at {sortArrow("createdAt")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("role")}
            >
              Role {sortArrow("role")}
            </th>
            <th>View</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {sortedMembers.map((member, idx) => {
            const createdAtFormatted = new Date(member.createdAt).toLocaleDateString('de-DE');
            return (
              <tr key={member.id || idx} className="hover:bg-primary/50 bg-primary/30">
                <td className="font-semibold">{member.name || "No Name"}</td>
                <td>{member.email}</td>
                <td>{createdAtFormatted}</td>
                <td className="uppercase font-bold">{member.role}</td>
                <td>
                  <Link
                    href={`/dashboard/member/${member.id}`}
                    className="font-semibold text-blue-600 hover:underline flex flex-col justify-center items-center gap-1"
                  >
                    <Eye className="inline-block mr-1" /> View
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/dashboard/edit-member/${member.id}`}
                    className="font-semibold text-yellow-500 hover:underline flex flex-col justify-center items-center gap-1"
                  >
                    <UserSearch className="inline-block mr-1" /> Edit
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}