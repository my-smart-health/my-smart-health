'use client';

import { useState } from "react";
import { Triangle } from "lucide-react";

import { CategoryNodeSH } from "@/utils/types";

import ProfileShort from "@/components/profile/profile-short/ProfileShort";

export default function CategoryAccordion({
  node,
  level = 0,
  parentKey = "",
}: {
  node: CategoryNodeSH;
  level?: number;
  parentKey?: string;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (cat: string) => {
    setOpen((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <>
      {[...node.children.entries()].map(([catName, child]) => {
        const key = parentKey + catName;
        const isOpen = !!open[key];
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
                    </div>
                  )
                })}
                <CategoryAccordion node={child} level={level + 1} parentKey={key + "-"} />
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
    </>
  );
}