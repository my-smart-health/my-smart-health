'use client'

import { useRef, useState, useEffect } from "react";

type SeeMoreLessProps = {
  text?: string;
  lines?: number;
  addClass?: string;
  children?: React.ReactNode;
};

export default function SeeMoreLess({ text, lines, addClass, children }: SeeMoreLessProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const getLineClampClass = () => {
    const clampLines = Math.max(1, Math.min(lines || 3, 6));
    const clampClasses: Record<number, string> = {
      1: 'line-clamp-1',
      2: 'line-clamp-2',
      3: 'line-clamp-3',
      4: 'line-clamp-4',
      5: 'line-clamp-5',
      6: 'line-clamp-6',
    };
    return clampClasses[clampLines] || 'line-clamp-3';
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const checkClamp = () => {
      const isClamping = el.scrollHeight > el.clientHeight + 1;
      setIsClamped(isClamping);
    };

    const timeoutId = setTimeout(checkClamp, 100);

    window.addEventListener("resize", checkClamp);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkClamp);
    };
  }, [text, children]);

  return (
    <div className="w-full">
      <div
        ref={sectionRef}
        className={`w-full ${expanded ? "" : getLineClampClass()} ${addClass || ""}`}
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          display: expanded ? 'block' : '-webkit-box',
          WebkitBoxOrient: expanded ? undefined : 'vertical' as const,
          overflow: expanded ? 'visible' : 'hidden',
        }}
      >
        {children || text}
      </div>
      {(isClamped || expanded) && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-primary mt-2 cursor-pointer select-none italic hover:underline focus:outline-none"
          type="button"
        >
          {expanded ? "Weniger anzeigen" : "Mehr erfahren"}
        </button>
      )}
    </div>
  );
}
