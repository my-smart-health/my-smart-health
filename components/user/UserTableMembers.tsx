"use client";

import Link from "next/link";
import { UserSearch, Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Member = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date | string;
  role: string;
};

type SortKey = keyof Pick<Member, "name" | "email" | "role" | "createdAt">;

export default function UserTableMembers({ members }: { members: Member[] }) {
  const router = useRouter();
  const t = useTranslations('UserTableMembers');
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [allMembers, setAllMembers] = useState(members);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

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

  const handleDeleteMember = async (member: Member) => {
    const displayName = member.name?.trim() || member.email;
    const isConfirmed = window.confirm(
      t('confirm.deleteMember', { name: displayName }),
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setDeletingMemberId(member.id);
      const response = await fetch(
        `/api/delete/delete-member?memberId=${encodeURIComponent(member.id)}`,
        { method: "DELETE" },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        alert(data?.error || t('errors.deleteFailed'));
        return;
      }

      setAllMembers((prev) => prev.filter((item) => item.id !== member.id));
      router.refresh();
    } catch {
      alert(t('errors.deleteFailed'));
    } finally {
      setDeletingMemberId(null);
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("name")}
            >
              {t('columns.name')} {sortArrow("name")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("email")}
            >
              {t('columns.email')} {sortArrow("email")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("createdAt")}>
              {t('columns.createdAt')} {sortArrow("createdAt")}
            </th>
            <th
              className="cursor-pointer select-none"
              onClick={() => handleSort("role")}
            >
              {t('columns.role')} {sortArrow("role")}
            </th>
            <th>{t('columns.view')}</th>
            <th>{t('columns.edit')}</th>
            <th>{t('columns.delete')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedMembers.map((member, idx) => {
            const createdAtFormatted = new Date(member.createdAt).toLocaleDateString('de-DE');
            return (
              <tr key={member.id || idx} className="hover:bg-primary/50 bg-primary/30">
                <td className="font-semibold">{member.name || t('noName')}</td>
                <td>{member.email}</td>
                <td>{createdAtFormatted}</td>
                <td className="uppercase font-bold">{member.role}</td>
                <td>
                  <Link
                    href={`/dashboard/member/${member.id}`}
                    className="font-semibold text-blue-600 hover:underline flex flex-col justify-center items-center gap-1"
                  >
                    <Eye className="inline-block mr-1" /> {t('actions.view')}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/dashboard/edit-member/${member.id}`}
                    className="font-semibold text-yellow-500 hover:underline flex flex-col justify-center items-center gap-1"
                  >
                    <UserSearch className="inline-block mr-1" /> {t('actions.edit')}
                  </Link>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(member)}
                    disabled={deletingMemberId === member.id}
                    className="font-semibold text-red-500 hover:underline flex flex-col justify-center items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="inline-block mr-1" />
                    {deletingMemberId === member.id ? t('actions.deleting') : t('actions.delete')}
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