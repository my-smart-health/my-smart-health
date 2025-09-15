'use client'

import { useRef, useState, useEffect } from "react";

export default function SeeMoreLess({ text, lines, addClass }: { text: string, lines?: number, addClass?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Only allow up to 6 lines for clamping
  const clampLines = Math.max(1, Math.min(lines || 3, 6));

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
        className={`break-before-all ${expanded ? "line-clamp-none" : `line-clamp-${clampLines}`} ${addClass} transform-content transition-all ease-in-out duration-1000`}
        style={{ overflow: "hidden" }}
      >
        {text}
      </div>
      {(isClamped || expanded) && (
        <span
          onClick={() => setExpanded(e => !e)}
          className="text-primary ml-2 flex place-self-end cursor-pointer select-none italic "
        >
          {expanded ? "Weniger anzeigen" : "Mehr erfahren"}
        </span>
      )}
    </>
  );
}
