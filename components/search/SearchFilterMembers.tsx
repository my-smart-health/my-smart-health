'use client';

import { useMemo, useState } from "react";
import UserTableMembers from "../user/UserTableMembers";


type Member = {
  id: string;
  email: string;
  role: string;
  createdAt: Date | string;
  name: string | null;
};

type SearchFilterProps = {
  members: Member[];
};

export default function SearchFilterMembers({ members }: SearchFilterProps) {
  const [query, setQuery] = useState("");

  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return members;
    return members.filter((member) => {
      const name = (member.name || "").toLowerCase();
      const email = (member.email || "").toLowerCase();
      return name.includes(normalized) || email.includes(normalized);
    });
  }, [members, query]);

  return (
    <>
      <input
        type="search"
        placeholder="Search members by name or email..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 w-[90%] max-w-md mb-4"
      />
      <UserTableMembers members={filteredMembers} />
    </>
  );
}