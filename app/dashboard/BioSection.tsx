'use client'
import { useState } from "react";
export function BioSection({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <section className={`break-before-all ${expanded ? "line-clamp-none" : "line-clamp-3"}`}>
        {bio}
      </section>
      <button
        onClick={() => setExpanded(e => !e)}
        className="text-primary ml-2 flex place-self-end">
        {expanded ? "Show less" : "Show more"}
      </button>
    </>
  );
}
