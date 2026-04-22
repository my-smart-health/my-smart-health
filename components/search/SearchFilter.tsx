'use client';

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import UserTable from "../user/UserTable";

type User = {
  category: string[];
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  name: string | null;
  profileImages: string[];
  isContactable: boolean;
};

type SearchFilterProps = {
  users: User[];
  currentUserId: string;
};

export default function SearchFilter({ users, currentUserId }: SearchFilterProps) {
  const t = useTranslations('SearchFilter');
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter((user) => {
      const name = (user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      return name.includes(normalized) || email.includes(normalized);
    });
  }, [users, query]);

  return (
    <>
      <input
        type="search"
        placeholder={t('placeholder')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="p-3 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 w-[90%] max-w-md mb-4"
      />
      <UserTable users={filteredUsers} currentUserId={currentUserId} />
    </>
  );
}