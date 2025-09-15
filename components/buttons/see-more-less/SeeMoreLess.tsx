'use client'

import { useRef, useState, useEffect } from "react";

export default function SeeMoreLess({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const checkClamp = () => {
      setIsClamped(el.scrollHeight > el.clientHeight);
    };
    checkClamp();
    window.addEventListener("resize", checkClamp);
    return () => window.removeEventListener("resize", checkClamp);
  }, [text, expanded]);

  return (
    <>
      <div
        ref={sectionRef}
        className={`break-before-all ${expanded ? "line-clamp-none" : "line-clamp-3"}`}
        style={{ overflow: "hidden" }}
      >
        {text}
      </div>
      {(isClamped || expanded) && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-primary ml-2 flex place-self-end"
        >
          {expanded ? "Weniger anzeigen" : "Mehr erfahren"}
        </button>
      )}
    </>
  );
}
