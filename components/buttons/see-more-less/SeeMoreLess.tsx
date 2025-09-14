'use client'

import { MAX_BIO_LENGTH_CLAMP } from "@/utils/constants";
import { useState } from "react";

export default function SeeMoreLess({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <section className={`break-before-all ${expanded ? "line-clamp-none" : "line-clamp-3"}`}>
        {text}
      </section>
      <button
        onClick={() => setExpanded(e => !e)}
        className="text-primary ml-2 flex place-self-end">
        {text.length > MAX_BIO_LENGTH_CLAMP ? expanded ? "Weniger anzeigen" : "Mehr erfahren" : null}
      </button>
    </>
  );
}
