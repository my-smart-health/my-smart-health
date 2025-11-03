'use client'

import { useEffect, useRef, useState } from 'react';

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
  const clampLines = Math.max(1, Math.min(lines || 3, 10));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const getLineHeightPx = () => {
      const cs = getComputedStyle(el);
      const lh = cs.lineHeight;
      if (lh === 'normal') {
        const fontSize = parseFloat(cs.fontSize) || 16;
        return 1.6 * fontSize;
      }
      const px = parseFloat(lh);
      return isNaN(px) ? 24 : px;
    };

    const recompute = () => {
      const clampPx = getLineHeightPx() * clampLines;
      const fullHeight = el.scrollHeight; // total content height
      setIsClamped(fullHeight > clampPx + 1);
    };

    const rafId = requestAnimationFrame(recompute);
    window.addEventListener('resize', recompute);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => recompute());
      resizeObserver.observe(el);
    }

    const mutationObserver = new MutationObserver(() => recompute());
    mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', recompute);
      if (resizeObserver) resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [clampLines, text, children]);

  const showToggle = isClamped || expanded;

  return (
    <div className="w-full">
      <div
        ref={sectionRef}
        className={`w-full ${expanded ? '' : 'multi-clamp'} ${addClass || ''}`}
        style={{
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          WebkitLineClamp: expanded ? 'unset' : clampLines,
        }}
      >
        {children || text}
      </div>
      {showToggle && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-primary mt-2 cursor-pointer select-none italic hover:underline focus:outline-none"
          type="button"
        >
          {expanded ? 'Weniger anzeigen' : 'Mehr erfahren'}
        </button>
      )}
    </div>
  );
}
