"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { getReadOnlyExtensions } from "@/utils/tiptap-extensions";

type ParagraphContentProps = {
  content: string;
  maxLines?: number;
  className?: string;
};

export default function ParagraphContent({ content, maxLines = 3, className = "" }: ParagraphContentProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const clampLines = Math.max(1, Math.min(maxLines, 10));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getReadOnlyExtensions(),
    content: content || "",
    editable: false,
    editorProps: {
      attributes: {
        class: `bio-content max-w-none focus:outline-none ${className}`,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const next = content || "";
    if (editor.getHTML() !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, content]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: `bio-content max-w-none focus:outline-none ${className}`,
        },
      },
    });
  }, [editor, className]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || !editor) return;

    const getLineHeightPx = (node: HTMLElement) => {
      const cs = getComputedStyle(node);
      const lh = cs.lineHeight;
      if (lh === "normal") {
        const fontSize = parseFloat(cs.fontSize) || 16;
        return 1.6 * fontSize;
      }
      const px = parseFloat(lh);
      return Number.isNaN(px) ? 24 : px;
    };

    const recompute = () => {
      const prosemirror = el.querySelector('.ProseMirror') as HTMLElement | null;
      if (!prosemirror) return;

      const clampPx = getLineHeightPx(prosemirror) * clampLines;
      const fullHeight = prosemirror.scrollHeight;
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
  }, [editor, clampLines, content]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const prosemirror = root.querySelector('.ProseMirror') as HTMLElement | null;
    if (!prosemirror) return;

    const shouldClamp = isClamped && !expanded;
    if (shouldClamp) {
      prosemirror.style.display = '-webkit-box';
      prosemirror.style.setProperty('-webkit-box-orient', 'vertical');
      prosemirror.style.setProperty('-webkit-line-clamp', String(clampLines));
      prosemirror.style.overflow = 'hidden';
      prosemirror.style.textOverflow = 'ellipsis';
      prosemirror.style.wordBreak = 'break-word';
    } else {
      prosemirror.style.removeProperty('display');
      prosemirror.style.removeProperty('-webkit-box-orient');
      prosemirror.style.removeProperty('-webkit-line-clamp');
      prosemirror.style.removeProperty('overflow');
      prosemirror.style.removeProperty('text-overflow');
      prosemirror.style.removeProperty('word-break');
    }

    return () => {
      prosemirror.style.removeProperty('display');
      prosemirror.style.removeProperty('-webkit-box-orient');
      prosemirror.style.removeProperty('-webkit-line-clamp');
      prosemirror.style.removeProperty('overflow');
      prosemirror.style.removeProperty('text-overflow');
      prosemirror.style.removeProperty('word-break');
    };
  }, [isClamped, expanded, clampLines]);

  if (!content) return null;

  const showToggle = isClamped || expanded;

  return (
    <div className="w-full" ref={contentRef}>
      <EditorContent editor={editor} />
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
