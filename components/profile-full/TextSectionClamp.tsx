'use client'

import { useState } from "react";

export default function TextSectionClamp({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <section className={`break-before-all ${expanded ? "line-clamp-none" : "line-clamp-3"}`}>
        {text}
      </section>
      <button
        onClick={() => setExpanded(e => !e)}
        className="text-primary ml-2 flex place-self-end">
        {expanded ? "Show less" : "Show more"}
      </button>
    </>
  );
}
